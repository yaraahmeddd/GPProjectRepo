
import json

translations = {
    "ar": {
        "registration": {
            "title": "طلبات التسجيل",
            "pending": "قيد الانتظار",
            "request_one": "طلب",
            "request_other": "طلبات",
            "members": "أعضاء",
            "teamMembers": "أعضاء فريق",
            "refresh": "تحديث",
            "searchPlaceholder": "بحث بالاسم، الرقم القومي، أو الهاتف...",
            "all": "الكل",
            "results": "نتيجة",
            "loading": "جارٍ التحميل...",
            "noRequests": "لا يوجد طلبات حالياً",
            "noResults": "لا توجد نتائج مطابقة لـ",
            "noPendingRequests": "لم يتم العثور على طلبات تسجيل جديدة قيد الانتظار"
        },
        "table": {
            "index": "#",
            "name": "الاسم",
            "phone": "رقم الهاتف",
            "nationalId": "الرقم القومي",
            "registrationDate": "تاريخ التسجيل",
            "type": "النوع",
            "status": "الحالة",
            "actions": "الإجراءات"
        },
        "memberTypes": {
            "member": "عضو",
            "teamMember": "عضو فريق"
        },
        "status": {
            "active": "نشط",
            "pending": "قيد الانتظار"
        },
        "actions": {
            "review": "مراجعة",
            "approve": "اعتماد",
            "processing": "جارٍ...",
            "print": "طباعة",
            "close": "إغلاق",
            "cancel": "إلغاء",
            "save": "حفظ"
        },
        "toast": {
            "error": "خطأ",
            "success": "تم بنجاح",
            "approved": "تم الاعتماد",
            "added": "تم الإضافة",
            "loadFailed": "فشل تحميل طلبات التسجيل",
            "approveFailed": "فشل اعتماد الطلب. حاول مرة أخرى.",
            "addMemberFailed": "فشل إضافة العضو",
            "memberAdded": "تم إضافة العضو الجديد بنجاح",
            "activated": "تم تفعيل {{type}} بنجاح"
        },
        "addMember": {
            "title": "إضافة عضو جديد",
            "description": "أدخل بيانات العضو الجديد للتسجيل",
            "nameAr": "الاسم (عربي)",
            "nameEn": "الاسم (English)",
            "nameArPlaceholder": "الاسم رباعي",
            "nameEnPlaceholder": "Full Name",
            "nationalId": "الرقم القومي",
            "nationalIdPlaceholder": "14 رقم",
            "phone": "رقم الهاتف (واتساب)",
            "phonePlaceholder": "01xxxxxxxxx",
            "birthDate": "تاريخ الميلاد",
            "gender": "النوع",
            "selectGender": "اختر النوع",
            "male": "ذكر",
            "female": "أنثى",
            "address": "العنوان",
            "addressPlaceholder": "العنوان بالتفصيل",
            "socialStatus": "الحالة الاجتماعية",
            "selectStatus": "اختر الحالة",
            "single": "أعزب",
            "married": "متزوج",
            "widowed": "أرمل",
            "divorced": "مطلق",
            "job": "الوظيفة",
            "jobPlaceholder": "المهنة / الوظيفة",
            "childrenCount": "عدد الأبناء",
            "saving": "جارٍ الحفظ..."
        },
        "review": {
            "title": "مراجعة الطلب",
            "memberData": "👤 بيانات العضو",
            "documents": "🖼️ المستندات والصور",
            "noPhoto": "لا توجد صورة",
            "registered": "تسجيل",
            "age": "سنة",
            "specialData": "البيانات الخاصة",
            "membershipType": "نوع العضوية",
            "socialMember": "👤 عضو اجتماعي",
            "sportsTeamMember": "🏅 عضو فريق رياضي",
            "job": "الوظيفة / المهنة",
            "registeredTeams": "الفرق الرياضية المسجل بها",
            "personalPhoto": "الصورة الشخصية",
            "noPersonalPhoto": "لا توجد صورة شخصية",
            "idFront": "بطاقة الرقم القومي (أمام)",
            "idBack": "بطاقة الرقم القومي (خلف)",
            "notUploaded": "لم يتم الرفع",
            "medicalReport": "التقرير الطبي",
            "noMedicalReport": "لم يتم ارفاق تقرير طبي",
            "approving": "جارٍ الاعتماد...",
            "approveMembership": "اعتماد {{type}}"
        },
        "print": {
            "formFee": "قيمة الإستمارة (٢٥٠ ج)",
            "teamMembershipForm": "استمارة عضوية فريق",
            "membershipForm": "استمارة عضوية",
            "clubName": "نادي جامعة حلوان",
            "clubNameEn": "Helwan Univ. Club",
            "photo": "صورة",
            "name": "الاسم",
            "birthDate": "تاريخ الميلاد",
            "gender": "النوع",
            "address": "العنوان",
            "teams": "الفرق",
            "socialStatus": "الحالة الاجتماعية",
            "single": "اعزب",
            "married": "متزوج",
            "marriedWithDependents": "متزوج ويعول",
            "widowed": "ارمل",
            "divorced": "مطلق",
            "phone": "الهاتف واتس اب",
            "declaration": "إقرار",
            "iDeclare": "أقر أنا",
            "nationalId": "رقم قومي",
            "declareBelow": "الموقع ادناه بأن",
            "declarationText": "البيانات الواردة في هذه الاستمارة صحيحة على مسؤوليتي الشخصية مع الالتزام بالقانون الرياضي المصري ولائحة النظام الأساسي لأندية الشركات والمصانع والوزارات والمصالح الحكومية ووحدات الإدارة المحلية والهيئات العامة وأجهزة الدولة وسلطاتها واللائحة المالية وتعديلاتها.",
            "issuedOn": "تحريراً في",
            "year": "20 م",
            "acknowledged": "المقر بما فيه",
            "signatureName": "الاسم",
            "signature": "التوقيع"
        },
        "gender": {
            "male": "👨 ذكر",
            "female": "👩 أنثى"
        },
        "socialStatus": {
            "single": "أعزب / عزباء",
            "married": "متزوج / متزوجة",
            "widowed": "أرمل / أرملة",
            "divorced": "مطلق / مطلقة"
        },
        "common": {
            "notAvailable": "—"
        }
    },
    "en": {
        "registration": {
            "title": "Registration Requests",
            "pending": "Pending",
            "request_one": "request",
            "request_other": "requests",
            "members": "Members",
            "teamMembers": "Team Members",
            "refresh": "Refresh",
            "searchPlaceholder": "Search by name, national ID, or phone...",
            "all": "All",
            "results": "result(s)",
            "loading": "Loading...",
            "noRequests": "No requests currently",
            "noResults": "No results matching",
            "noPendingRequests": "No new pending registration requests found"
        },
        "table": {
            "index": "#",
            "name": "Name",
            "phone": "Phone Number",
            "nationalId": "National ID",
            "registrationDate": "Registration Date",
            "type": "Type",
            "status": "Status",
            "actions": "Actions"
        },
        "memberTypes": {
            "member": "Member",
            "teamMember": "Team Member"
        },
        "status": {
            "active": "Active",
            "pending": "Pending"
        },
        "actions": {
            "review": "Review",
            "approve": "Approve",
            "processing": "Processing...",
            "print": "Print",
            "close": "Close",
            "cancel": "Cancel",
            "save": "Save"
        },
        "toast": {
            "error": "Error",
            "success": "Success",
            "approved": "Approved",
            "added": "Added",
            "loadFailed": "Failed to load registration requests",
            "approveFailed": "Failed to approve request. Please try again.",
            "addMemberFailed": "Failed to add member",
            "memberAdded": "New member added successfully",
            "activated": "{{type}} activated successfully"
        },
        "addMember": {
            "title": "Add New Member",
            "description": "Enter new member data for registration",
            "nameAr": "Name (Arabic)",
            "nameEn": "Name (English)",
            "nameArPlaceholder": "Full Arabic name",
            "nameEnPlaceholder": "Full Name",
            "nationalId": "National ID",
            "nationalIdPlaceholder": "14 digits",
            "phone": "Phone Number (WhatsApp)",
            "phonePlaceholder": "01xxxxxxxxx",
            "birthDate": "Birth Date",
            "gender": "Gender",
            "selectGender": "Select Gender",
            "male": "Male",
            "female": "Female",
            "address": "Address",
            "addressPlaceholder": "Detailed address",
            "socialStatus": "Social Status",
            "selectStatus": "Select Status",
            "single": "Single",
            "married": "Married",
            "widowed": "Widowed",
            "divorced": "Divorced",
            "job": "Job",
            "jobPlaceholder": "Profession / Job",
            "childrenCount": "Number of Children",
            "saving": "Saving..."
        },
        "review": {
            "title": "Review Request",
            "memberData": "👤 Member Data",
            "documents": "🖼️ Documents & Photos",
            "noPhoto": "No photo",
            "registered": "Registered",
            "age": "years",
            "specialData": "Special Data",
            "membershipType": "Membership Type",
            "socialMember": "👤 Social Member",
            "sportsTeamMember": "🏅 Sports Team Member",
            "job": "Job / Profession",
            "registeredTeams": "Registered Sports Teams",
            "personalPhoto": "Personal Photo",
            "noPersonalPhoto": "No personal photo",
            "idFront": "National ID Card (Front)",
            "idBack": "National ID Card (Back)",
            "notUploaded": "Not uploaded",
            "medicalReport": "Medical Report",
            "noMedicalReport": "No medical report attached",
            "approving": "Approving...",
            "approveMembership": "Approve {{type}}"
        },
        "print": {
            "formFee": "Form Fee (250 EGP)",
            "teamMembershipForm": "Team Membership Form",
            "membershipForm": "Membership Form",
            "clubName": "Helwan University Club",
            "clubNameEn": "Helwan Univ. Club",
            "photo": "Photo",
            "name": "Name",
            "birthDate": "Birth Date",
            "gender": "Gender",
            "address": "Address",
            "teams": "Teams",
            "socialStatus": "Social Status",
            "single": "Single",
            "married": "Married",
            "marriedWithDependents": "Married with Dependents",
            "widowed": "Widowed",
            "divorced": "Divorced",
            "phone": "Phone / WhatsApp",
            "declaration": "Declaration",
            "iDeclare": "I, the undersigned",
            "nationalId": "National ID",
            "declareBelow": "declare below that",
            "declarationText": "The information provided in this form is true and correct under my personal responsibility, with commitment to the Egyptian Sports Law and the statutes of clubs for companies, factories, ministries, government agencies, local administration units, public bodies, state apparatus and authorities, and the financial regulations and their amendments.",
            "issuedOn": "Issued on",
            "year": "20",
            "acknowledged": "Acknowledged",
            "signatureName": "Name",
            "signature": "Signature"
        },
        "gender": {
            "male": "👨 Male",
            "female": "👩 Female"
        },
        "socialStatus": {
            "single": "Single",
            "married": "Married",
            "widowed": "Widowed",
            "divorced": "Divorced"
        },
        "common": {
            "notAvailable": "—"
        }
    }
}

with open('/mnt/agents/output/translations.json', 'w', encoding='utf-8') as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)

print("Translation file created successfully!")
print(f"Total keys in AR: {sum(len(v) if isinstance(v, dict) else 1 for v in translations['ar'].values())}")
print(f"Total keys in EN: {sum(len(v) if isinstance(v, dict) else 1 for v in translations['en'].values())}")
