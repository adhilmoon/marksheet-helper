# Marksheet Helper (മാർക്ക്ഷീറ്റ് സഹായി)

മദ്രസകൾക്കും സ്കൂളുകൾക്കുമുള്ള ലളിതവും ആധുനികവുമായ മാർക്ക്ഷീറ്റ് മാനേജ്‌മെന്റ് ആപ്ലിക്കേഷൻ.
ഇതിൽ ഓരോ അധ്യാപകനും സ്വന്തം യൂസർ ഐഡിയും പാസ്‌വേഡും ഉപയോഗിച്ച് പ്രവേശിച്ച് അവരുടെ ക്ലാസുകൾ, വിഷയങ്ങൾ, വിദ്യാർത്ഥികളുടെ വിവരങ്ങൾ എന്നിവ ക്രമീകരിക്കാം.

ബാഹ്യ ഡാറ്റാബേസ് (Database) ആവശ്യമില്ലാതെ, ബ്രൗസറിന്റെ **ലോക്കൽ സ്റ്റോറേജ് (Local Storage)** ഉപയോഗിച്ചാണ് ഡാറ്റ സൂക്ഷിക്കുന്നത്. അതിനാൽ ഇത് പൂർണ്ണമായും സ്വകാര്യവും വേഗതയേറിയതുമാണ്.

---

## 🌟 പ്രധാന സവിശേഷതകൾ (Key Features)

1. **യൂസർ ഓതന്റിക്കേഷൻ (User Authentication & Isolation)**:
   - യൂസർ ഐഡിയും (User ID) പാസ്‌വേഡും ഉപയോഗിച്ച് രജിസ്റ്റർ ചെയ്യാനും ലോഗിൻ ചെയ്യാനുമുള്ള സൗകര്യം.
   - ഓരോ യൂസറുടെയും ഡാറ്റ അവർക്ക് മാത്രമായി വേർതിരിച്ച് സൂക്ഷിക്കുന്നു (Isolated Local Storage Vault).
   - ഡാറ്റ നഷ്ടപ്പെടാതിരിക്കാൻ JSON ബാക്കപ്പ് ഡൗൺലോഡ് ചെയ്യാനും തിരിച്ചെടുക്കാനും (Restore) സാധിക്കും.

2. **ക്ലാസ് & പരീക്ഷ ക്രമീകരണം (Class & Exam Setup)**:
   - മദ്രസ / സ്കൂളിന്റെ പേര് (Madrasa / School Name)
   - ക്ലാസ്സ് / സ്റ്റാൻഡേർഡ് (Class / Standard)
   - പരീക്ഷയുടെ പേര് (Examination Name)
   - അക്കാദമിക് വർഷം (Academic Year)
   - പാസ്സ് മാർക്ക് ശതമാനം (Pass Percentage threshold)

3. **വിഷയങ്ങൾ / ടോപ്പിക്സ് (Topics & Columns)**:
   - ഓരോ വിഷയത്തിന്റെയും പേരും പരമാവധി മാർക്കും (Max Marks) നിശ്ചയിക്കാം (ഉദാ: ഖുർആൻ, തജ്‌വീദ്, ഫിഖ്ഹ്, താരീഖ്).
   - എത്ര വിഷയങ്ങൾ വേണമെങ്കിലും ചേർക്കാം; അവ മാർക്ക്ഷീറ്റിൽ ഡൈനാമിക് കോളങ്ങളായി (Columns) വരുന്നതാണ്.

4. **ലിംഗഭേദമനുസരിച്ചുള്ള പ്രത്യേക ഷീറ്റുകൾ (Boys & Girls Separate Sheets)**:
   - **👦 ആൺകുട്ടികൾ (Boys Sheet)**: ആൺകുട്ടികളുടെ വിവരങ്ങൾ മാത്രമുള്ള ഷീറ്റ്.
   - **👧 പെൺകുട്ടികൾ (Girls Sheet)**: പെൺകുട്ടികളുടെ വിവരങ്ങൾ മാത്രമുള്ള ഷീറ്റ്.
   - **👥 എല്ലാവരും (All Students)**: ക്ലാസിലെ എല്ലാ വിദ്യാർത്ഥികളുടെയും സംയുക്ത ഷീറ്റ്.
   - ഒറ്റയ്ക്കോ കൂട്ടമായോ (Bulk Add) വിദ്യാർത്ഥികളെ റോൾ നമ്പർ സഹിതം ചേർക്കാം.

5. **ലളിതമായ ഡെയ്‌ലി മാർക്ക് എൻട്രി (Daily / Fast Inline Mark Entry)**:
   - കീബോർഡ് എന്റർ, ആരോ കീകൾ (Arrow Keys: Up/Down/Left/Right) എന്നിവ ഉപയോഗിച്ച് അതിവേഗം മാർക്ക് രേഖപ്പെടുത്താം.
   - ആബ്സെന്റ് ആയ കുട്ടികൾക്ക് `ab` എന്ന് നൽകിയാൽ മതിയാകും.
   - ഓരോ കുട്ടിയുടെയും ആകെ മാർക്ക് (Total), ശതമാനം (Percentage), ഗ്രേഡ് (Grade: A+, A, B+...), റാങ്ക് (Rank), പാസ്സ് / തോറ്റു (Status) എന്നിവ തത്സമയം സ്വയം കണക്കുകൂട്ടുന്നു.
   - നൽകുന്ന ഓരോ മാർക്കും തത്സമയം സ്വയം സേവ് (Auto-save) ആകുന്നു.

6. **റിസൾട്ട് വിശകലനവും എക്സ്പോർട്ടും (Analytics & Export)**:
   - **📄 PDF Export**: മദ്രസയുടെ പേര്, പരീക്ഷ, വിദ്യാർത്ഥികളുടെ പട്ടിക, അധ്യാപകന്റെയും പ്രിൻസിപ്പലിന്റെയും ഒപ്പിടാനുള്ള സ്ഥലം എന്നിവ അടങ്ങിയ പ്രൊഫഷണൽ പ്രിന്റ്-റെഡി പിഡിഎഫ്.
   - **📊 Excel (.xlsx) Export**: സ്പ്രെഡ്ഷീറ്റുകളിലേക്ക് ഒറ്റ ക്ലിക്കിൽ ഡൗൺലോഡ് ചെയ്യാം.
   - **🖨️ Print Layout**: നേരിട്ട് പേപ്പറിൽ പ്രിന്റ് എടുക്കാനുള്ള ക്രമീകരണം (`@media print`).

---

## 🏛️ ആർക്കിടെക്ചർ (MVC Architecture)

ആപ്ലിക്കേഷൻ കർശനമായ **MVC (Model - View - Controller)** മാതൃകയിലാണ് ക്രമീകരിച്ചിരിക്കുന്നത്:

```
Marksheet helper/
├── app.py                      # Flask Backend (MVC Web Server)
├── server.py                   # Zero-dependency Python Server (Built-in http.server)
├── index.html                  # Standalone SPA Shell (Direct browser runner)
├── requirements.txt            # Python Dependencies
├── templates/
│   └── index.html              # Flask Template View
└── static/
    ├── css/
    │   └── style.css           # Clean, Minimal Modern Design & Print CSS
    ├── js/
    │   ├── models/
    │   │   ├── StorageModel.js # Data Vault, User Auth, LocalStorage Management
    │   │   └── MarksheetModel.js # Calculation Engine (Totals, Grades, Ranks, Stats)
    │   ├── views/
    │   │   ├── AuthView.js     # Login & Register UI
    │   │   ├── DashboardView.js# Class Management & Stats UI
    │   │   ├── MarksheetView.js# Interactive Grid, Boys/Girls Tabs, Daily Input
    │   │   └── ExportView.js   # PDF & Excel Generation, Print Engine
    │   ├── controllers/
    │   │   ├── AuthController.js
    │   │   ├── ClassController.js
    │   │   └── MarksheetController.js
    │   └── app.js              # Bootstrap & Routing
    └── vendor/
        ├── jspdf.umd.min.js    # PDF Engine
        ├── jspdf.plugin.autotable.min.js
        └── xlsx.full.min.js    # Excel (.xlsx) Engine
```

---

## 🚀 പ്രവർത്തിപ്പിക്കേണ്ട വിധം (How to Run)

### രീതി 1: Flask ഉപയോഗിച്ച് (Recommended)
```bash
# Virtual Environment സജീവമാക്കുക
source .venv/bin/activate

# ആപ്പ് പ്രവർത്തിപ്പിക്കുക
python app.py
```
തുടർന്ന് നിങ്ങളുടെ ബ്രൗസറിൽ [http://localhost:5001](http://localhost:5001) തുറക്കുക.

---

### രീതി 2: ഒരു പാക്കേജും ഇല്ലാതെ പൈത്തൺ വഴി (Zero-Dependency)
```bash
python3 server.py
```
തുടർന്ന് ബ്രൗസറിൽ [http://localhost:8080](http://localhost:8080) തുറക്കുക.

---

### രീതി 3: നേരിട്ട് ബ്രൗസറിൽ തുറക്കുക (Standalone)
പൈത്തൺ ഇല്ലാതെ പോലും ഈ ഫോൾഡറിലെ `index.html` ഫയൽ ഡബിൾ ക്ലിക്ക് ചെയ്ത് ഏത് കമ്പ്യൂട്ടറിലോ ഫോണിലോ പ്രവർത്തിപ്പിക്കാം!

---

## 🔒 സ്വകാര്യതയും സുരക്ഷിതത്വവും (Data Privacy)
നിങ്ങൾ രേഖപ്പെടുത്തുന്ന മാർക്കുകളോ കുട്ടികളുടെ വിവരങ്ങളോ മറ്റൊരു സെർവറിലേക്കും അയക്കപ്പെടുന്നില്ല. എല്ലാം നിങ്ങളുടെ ഫോണിലോ കമ്പ്യൂട്ടറിലോ ഉള്ള ബ്രൗസറിൽ മാത്രമാണ് നിലനിൽക്കുന്നത്.
ബാക്കപ്പ് മെനുവിൽ നിന്നും എപ്പോൾ വേണമെങ്കിലും നിങ്ങളുടെ ഫയലുകൾ ഡൗൺലോഡ് ചെയ്ത് സൂക്ഷിക്കാവുന്നതാണ്.
