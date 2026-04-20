import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoleGuard } from "../Component/StaffPagesComponents/RoleGuard";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../Component/StaffPagesComponents/ui/table";
import { Button } from "../Component/StaffPagesComponents/ui/button";
import { Input } from "../Component/StaffPagesComponents/ui/input";
import { Label } from "../Component/StaffPagesComponents/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../Component/StaffPagesComponents/ui/dialog";
import { Plus, Loader2, Pencil, Eye, Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import api from "../api/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Faculty {
    id: number;
    code: string;
    name_ar: string;
    name_en: string;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FacultyManagementPage() {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editFaculty, setEditFaculty] = useState<Faculty | null>(null);
    const [form, setForm] = useState({ code: "", name_ar: "", name_en: "" });
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [assignFaculty, setAssignFaculty] = useState<Faculty | null>(null);
    const [memberIdForAssign, setMemberIdForAssign] = useState("");
    const [memberName, setMemberName] = useState("");
    const [memberLookupState, setMemberLookupState] = useState<"idle" | "loading" | "found" | "notfound">("idle");
    const [assignLoading, setAssignLoading] = useState(false);
    
    const { toast } = useToast();

    const fetchFaculties = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<{ success: boolean; data: Faculty[] }>("/faculties");
            const list = res?.data?.data;
            if (Array.isArray(list)) {
                setFaculties(list);
            } else {
                setFaculties([]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "تعذر تحميل الكليات";
            toast({ title: "فشل التحميل", description: message, variant: "destructive" });
            setFaculties([]);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        void fetchFaculties();
    }, [fetchFaculties]);

    const openAdd = () => {
        setEditFaculty(null);
        setForm({ code: "", name_ar: "", name_en: "" });
        setIsAddOpen(true);
    };

    const openEdit = (faculty: Faculty) => {
        setEditFaculty(faculty);
        setForm({ code: faculty.code, name_ar: faculty.name_ar, name_en: faculty.name_en });
        setIsAddOpen(true);
    };

    const handleSave = async () => {
        if (!form.code.trim() || !form.name_ar.trim() || !form.name_en.trim()) {
            toast({ title: "بيانات ناقصة", description: "يرجى ملء جميع الحقول المطلوبة.", variant: "destructive" });
            return;
        }

        setSaveLoading(true);
        try {
            const body = {
                code: form.code,
                name_ar: form.name_ar,
                name_en: form.name_en
            };

            if (editFaculty) {
                await api.put(`/faculties/${editFaculty.id}`, body);
                toast({ title: "تم التحديث", description: "تم تحديث بيانات الكلية بنجاح" });
            } else {
                await api.post("/faculties", body);
                toast({ title: "تمت الإضافة", description: "تمت إضافة الكلية بنجاح" });
            }
            setIsAddOpen(false);
            void fetchFaculties();
        } catch (err) {
            const e = err as { status?: number, responseData?: { message?: string, error?: string }, message?: string };
            const msg = e?.responseData?.error || e?.responseData?.message || e?.message || "حدث خطأ غير متوقع عند الحفظ";
            toast({ title: "فشل الحفظ", description: msg, variant: "destructive" });
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            await api.delete(`/faculties/${deleteId}`);
            toast({ title: "تم الحذف", description: "تم حذف الكلية بنجاح" });
            setDeleteId(null);
            void fetchFaculties();
        } catch (err) {
            const e = err as { status?: number, responseData?: { message?: string, error?: string }, message?: string };
            const msg = e?.responseData?.error || e?.responseData?.message || e?.message || "حدث خطأ غير متوقع عند الحذف";
            toast({ title: "فشل الحذف", description: msg, variant: "destructive" });
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        const numericId = memberIdForAssign.trim().replace(/\D/g, "");
        if (!numericId) { 
            setMemberLookupState("idle"); 
            setMemberName("");
            return; 
        }
        setMemberLookupState("loading");
        const timer = setTimeout(async () => {
            try {
                const res = await api.get<{ data: { name_ar?: string, full_name?: string, first_name_ar?: string, last_name_ar?: string } }>(`/members/${numericId}`);
                const m = res?.data?.data;
                if (m) {
                    const fullName = m.name_ar || m.full_name || [m.first_name_ar, m.last_name_ar].filter(Boolean).join(" ") || "عضو";
                    setMemberName(fullName);
                    setMemberLookupState("found");
                } else {
                    setMemberLookupState("notfound");
                }
            } catch {
                setMemberLookupState("notfound");
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [memberIdForAssign]);

    const handleAssign = async () => {
        if (!assignFaculty || !memberIdForAssign.trim()) {
            toast({ title: "بيانات ناقصة", description: "يرجى تحديد العضو المطلوب.", variant: "destructive" });
            return;
        }
        setAssignLoading(true);
        try {
            await api.post(`/faculties/${assignFaculty.id}/assign-to-member/${memberIdForAssign.trim()}`);
            toast({ title: "تم التعيين", description: "تم ربط العضو بالكلية بنجاح" });
            setAssignFaculty(null);
            setMemberIdForAssign("");
            setMemberName("");
        } catch (err) {
            const e = err as { status?: number, responseData?: { message?: string, error?: string }, message?: string };
            const msg = e?.responseData?.error || e?.responseData?.message || e?.message || "حدث خطأ غير متوقع عند التعيين";
            toast({ title: "فشل التعيين", description: msg, variant: "destructive" });
        } finally {
            setAssignLoading(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-6 pb-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">إدارة الكليات</h1>
                <RoleGuard privilege="CREATE_FACULTY">
                    <Button className="gap-2" onClick={openAdd}>
                        <Plus className="h-4 w-4" />
                        إضافة كلية
                    </Button>
                </RoleGuard>
            </div>

            {/* Table Area */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="shadow-sm border rounded-lg overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30">
                            <TableHead className="w-24">الكود</TableHead>
                            <TableHead>الاسم (عربي)</TableHead>
                            <TableHead>الاسم (إنجليزي)</TableHead>
                            <TableHead className="w-[260px] text-center">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <span>جارٍ تحميل البيانات...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : faculties.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <p>لا توجد كليات مسجلة حالياً</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <AnimatePresence>
                                {faculties.map((faculty) => (
                                    <motion.tr
                                        key={faculty.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="border-b border-border transition-colors duration-200 hover:bg-accent/10"
                                    >
                                        <TableCell className="font-mono font-medium text-muted-foreground">{faculty.code}</TableCell>
                                        <TableCell className="font-medium text-foreground">{faculty.name_ar}</TableCell>
                                        <TableCell dir="ltr" className="text-left font-medium text-foreground">{faculty.name_en}</TableCell>
                                        <TableCell className="whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <RoleGuard privilege="UPDATE_FACULTY">
                                                    <Button size="sm" variant="outline" className="gap-1 text-accent border-accent hover:bg-accent hover:text-accent-foreground" onClick={() => openEdit(faculty)}>
                                                        <Pencil className="h-3 w-3" /> تعديل
                                                    </Button>
                                                </RoleGuard>
                                                <RoleGuard privilege="DELETE_FACULTY">
                                                    <Button size="sm" variant="outline" className="gap-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => setDeleteId(faculty.id)}>
                                                        <Trash2 className="h-3 w-3" /> حذف
                                                    </Button>
                                                </RoleGuard>
                                                <RoleGuard privilege="ASSIGN_FACULTY_TO_MEMBER">
                                                    <Button size="sm" variant="outline" className="gap-1" onClick={() => setAssignFaculty(faculty)}>
                                                        <Eye className="h-3 w-3" /> تعيين عضو
                                                    </Button>
                                                </RoleGuard>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        )}
                    </TableBody>
                </Table>
            </motion.div>

            {/* Add/Edit Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>{editFaculty ? "تعديل كلية" : "إضافة كلية جديدة"}</DialogTitle>
                        <DialogDescription>
                            {editFaculty ? "قم بتعديل بيانات الكلية المحددة." : "أدخل بيانات الكلية الجديدة، الكود يستخدم للتعريف السريع."}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">الكود (Code) <span className="text-destructive">*</span></Label>
                            <Input 
                                id="code" 
                                dir="ltr" 
                                className="text-left font-mono" 
                                value={form.code} 
                                onChange={(e) => setForm({ ...form, code: e.target.value })} 
                                placeholder="e.g. COMP" 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name_ar">الاسم (عربي) <span className="text-destructive">*</span></Label>
                            <Input 
                                id="name_ar" 
                                value={form.name_ar} 
                                onChange={(e) => setForm({ ...form, name_ar: e.target.value })} 
                                placeholder="مثال: حاسبات ومعلومات" 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name_en">الاسم (إنجليزي) <span className="text-destructive">*</span></Label>
                            <Input 
                                id="name_en" 
                                dir="ltr" 
                                className="text-left" 
                                value={form.name_en} 
                                onChange={(e) => setForm({ ...form, name_en: e.target.value })} 
                                placeholder="e.g. Computer Science" 
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={saveLoading}>إلغاء</Button>
                        <Button onClick={() => void handleSave()} disabled={saveLoading}>
                            {saveLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {saveLoading ? "جارٍ الحفظ..." : "حفظ"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <DialogContent dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">تأكيد الحذف</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من حذف هذه الكلية؟ لا يمكن التراجع عن هذا الإجراء، وسيؤثر على سجلات الأعضاء المرتبطين.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:justify-start">
                        <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleteLoading}>إلغاء</Button>
                        <Button variant="destructive" onClick={() => void handleDelete()} disabled={deleteLoading}>
                            {deleteLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {deleteLoading ? "جارٍ الحذف..." : "تأكيد الحذف"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign Member Modal */}
            <Dialog open={assignFaculty !== null} onOpenChange={(open) => { 
                if (!open) { setAssignFaculty(null); setMemberIdForAssign(""); setMemberName(""); } 
            }}>
                <DialogContent dir="rtl">
                    <DialogHeader>
                        <DialogTitle>تعيين عضو في الكلية</DialogTitle>
                        <DialogDescription>
                            تحديد العضو المراد ربطه بكلية: <span className="font-bold">{assignFaculty?.name_ar}</span>
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <Label htmlFor="memberIdAssign">رقم العضو <span className="text-destructive">*</span></Label>
                        <div className="relative mt-2">
                            <Input
                                id="memberIdAssign"
                                dir="ltr"
                                className="text-left font-mono pr-8"
                                placeholder="12345"
                                value={memberIdForAssign}
                                onChange={(e) => setMemberIdForAssign(e.target.value)}
                            />
                            {memberLookupState === "loading" && (
                                <Loader2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
                            )}
                            {memberLookupState === "found" && (
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-600 text-[10px] font-bold">✓</span>
                            )}
                        </div>
                        {memberLookupState === "notfound" && (
                            <p className="text-[11px] text-destructive mt-1.5 ml-1">لم يُعثر على عضو بهذا الرقم</p>
                        )}
                        {memberLookupState === "idle" && !memberIdForAssign.trim() && (
                            <p className="text-[11px] text-muted-foreground mt-1.5 ml-1">أدخل رقم العضو للبحث</p>
                        )}
                        {memberLookupState === "found" && (
                            <p className="text-sm font-medium text-emerald-600 mt-2 p-2 bg-emerald-50 rounded-md border border-emerald-100">
                                الاسم: {memberName}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setAssignFaculty(null)} disabled={assignLoading}>إلغاء</Button>
                        <Button 
                            onClick={() => void handleAssign()} 
                            disabled={assignLoading || memberLookupState !== "found"}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {assignLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {assignLoading ? "جارٍ التعيين..." : "تأكيد التعيين"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
