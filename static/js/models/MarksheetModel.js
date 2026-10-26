/**
 * MarksheetModel.js
 * MVC - Model Layer: Marksheet calculations, totals, percentages, grades, ranks, and statistics.
 */

class MarksheetModel {
    // Grade boundaries
    static getGrade(percentage) {
        if (percentage >= 90) return { grade: 'A+', color: '#16a34a', point: 9 };
        if (percentage >= 80) return { grade: 'A',  color: '#22c55e', point: 8 };
        if (percentage >= 70) return { grade: 'B+', color: '#2563eb', point: 7 };
        if (percentage >= 60) return { grade: 'B',  color: '#3b82f6', point: 6 };
        if (percentage >= 50) return { grade: 'C+', color: '#d97706', point: 5 };
        if (percentage >= 40) return { grade: 'C',  color: '#f59e0b', point: 4 };
        if (percentage >= 30) return { grade: 'D',  color: '#dc2626', point: 3 };
        return { grade: 'F', color: '#ef4444', point: 0 };
    }

    /**
     * Compute full score row for a student
     */
    static computeStudentResult(student, topics, marksMap, passPercentage = 40) {
        const studentMarks = (marksMap && marksMap[student.id]) || {};
        let totalScored = 0;
        let totalMax = 0;
        let hasAnyMark = false;
        let hasAbsent = false;

        const topicScores = {};

        topics.forEach(topic => {
            const rawVal = studentMarks[topic.id];
            const max = Number(topic.maxMarks) || 100;
            totalMax += max;

            if (rawVal === 'Ab' || rawVal === 'ab' || rawVal === 'AB') {
                topicScores[topic.id] = { value: 'Ab', numeric: 0, isAbsent: true };
                hasAbsent = true;
                hasAnyMark = true;
            } else if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
                const num = Number(rawVal);
                const safeNum = isNaN(num) ? 0 : Math.max(0, Math.min(num, max));
                topicScores[topic.id] = { value: safeNum, numeric: safeNum, isAbsent: false };
                totalScored += safeNum;
                hasAnyMark = true;
            } else {
                topicScores[topic.id] = { value: '', numeric: 0, isAbsent: false, isEmpty: true };
            }
        });

        const percentage = totalMax > 0 ? ((totalScored / totalMax) * 100) : 0;
        const roundedPercentage = Math.round(percentage * 10) / 10;
        const gradeInfo = this.getGrade(roundedPercentage);
        const isPassed = roundedPercentage >= passPercentage;

        return {
            student,
            topicScores,
            totalScored,
            totalMax,
            percentage: roundedPercentage,
            grade: gradeInfo.grade,
            gradeColor: gradeInfo.color,
            status: isPassed ? 'Pass' : 'Fail',
            statusClass: isPassed ? 'status-pass' : 'status-fail',
            hasAnyMark,
            hasAbsent
        };
    }

    /**
     * Process an array of students, compute their scores and compute ranks
     */
    static processSheet(students, topics, marksMap, passPercentage = 40) {
        const results = students.map(st => this.computeStudentResult(st, topics, marksMap, passPercentage));

        // Sort by total scored descending to assign ranks
        const sorted = [...results].sort((a, b) => b.totalScored - a.totalScored);

        let currentRank = 1;
        sorted.forEach((item, index) => {
            if (index > 0 && item.totalScored < sorted[index - 1].totalScored) {
                currentRank = index + 1;
            }
            item.rank = item.hasAnyMark ? currentRank : '-';
        });

        // Return back in original student order (usually by Roll No)
        return results;
    }

    /**
     * Calculate summary statistics for a class
     */
    static calculateStats(classData) {
        const students = classData.students || [];
        const topics = classData.topics || [];
        const marks = classData.marks || {};
        const passPct = classData.passPercentage || 40;

        const boys = students.filter(s => s.gender === 'boy');
        const girls = students.filter(s => s.gender === 'girl');

        const allResults = this.processSheet(students, topics, marks, passPct);
        const boysResults = this.processSheet(boys, topics, marks, passPct);
        const girlsResults = this.processSheet(girls, topics, marks, passPct);

        const activeResults = allResults.filter(r => r.hasAnyMark);
        const passedCount = activeResults.filter(r => r.status === 'Pass').length;
        const totalMaxMarks = topics.reduce((sum, t) => sum + (Number(t.maxMarks) || 100), 0);

        const avgScore = activeResults.length > 0 
            ? Math.round((activeResults.reduce((sum, r) => sum + r.totalScored, 0) / activeResults.length) * 10) / 10
            : 0;

        const avgPercentage = activeResults.length > 0
            ? Math.round((activeResults.reduce((sum, r) => sum + r.percentage, 0) / activeResults.length) * 10) / 10
            : 0;

        // Topic-wise averages
        const topicStats = topics.map(topic => {
            const scores = [];
            students.forEach(st => {
                const markObj = (marks[st.id] && marks[st.id][topic.id]);
                if (markObj !== undefined && markObj !== '' && markObj !== 'Ab') {
                    scores.push(Number(markObj));
                }
            });
            const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '-';
            const highest = scores.length > 0 ? Math.max(...scores) : '-';
            return {
                topic,
                avg,
                highest,
                count: scores.length
            };
        });

        return {
            totalStudents: students.length,
            boysCount: boys.length,
            girlsCount: girls.length,
            topicsCount: topics.length,
            totalMaxMarks,
            activeCount: activeResults.length,
            passedCount,
            failedCount: activeResults.length - passedCount,
            passRate: activeResults.length > 0 ? Math.round((passedCount / activeResults.length) * 100) : 0,
            avgScore,
            avgPercentage,
            topicStats,
            allResults,
            boysResults,
            girlsResults
        };
    }
}

window.marksheetModel = MarksheetModel;
