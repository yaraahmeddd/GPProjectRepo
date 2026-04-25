import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ShieldCheck, X, AlertTriangle, Eye, Search } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../hooks/use-toast";

const theme = {
  primaryDark: "#1F3A5F",
  accentBlue: "#2EA7C9",
  background: "#F4F6F9",
  border: "#E5E7EB",
};

interface Privilege {
  id: number;
  name_ar?: string;
  name_en?: string;
  code?: string;
  module?: string;
}

interface Package {
  id: number;
  code: string;
  name_en: string;
  name_ar?: string;
  description?: string;
  privileges?: Privilege[];
}

// ─── Privileges Viewer Modal ──────────────────────────────────────────────────
function PrivilegesModal({
  pkg,
  onClose,
}: {
  pkg: Package;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const privileges = pkg.privileges ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return privileges;
    return privileges.filter((p) => {
      const label = (p.name_ar || p.name_en || p.code || "").toLowerCase();
      const mod = (p.module || "").toLowerCase();
      return label.includes(q) || mod.includes(q);
    });
  }, [privileges, search]);

  // Group by module if available
  const grouped = useMemo(() => {
    const hasModules = filtered.some((p) => p.module);
    if (!hasModules) return null;

    const map = new Map<string, Privilege[]>();
    filtered.forEach((p) => {
      const key = p.module || "عام";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      dir="rtl"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b shrink-0" style={{ borderColor: theme.border }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.accentBlue}15` }}>
                <ShieldCheck className="w-4 h-4" style={{ color: theme.accentBlue }} />
              </div>
              <div>
                <h2 className="text-base font-bold" style={{ color: theme.primaryDark }}>{pkg.name_en}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  <span className="font-semibold" style={{ color: theme.accentBlue }}>{privileges.length}</span> صلاحية مرتبطة
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في الصلاحيات..."
              autoFocus
              className="w-full pr-10 pl-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{ borderColor: theme.border }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {search && (
            <p className="text-xs text-gray-400 mt-2">
              {filtered.length} نتيجة من {privileges.length}
            </p>
          )}
        </div>

        {/* Privilege list */}
        <div className="flex-1 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">لا توجد صلاحيات مطابقة</p>
            </div>
          ) : grouped ? (
            // Grouped by module
            <div className="space-y-5">
              {grouped.map(([mod, items]) => (
                <div key={mod}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">
                    {mod}
                    <span className="mr-1.5 text-gray-300">({items.length})</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((p) => (
                      <span
                        key={p.id}
                        className="px-3 py-1.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: theme.accentBlue }}
                      >
                        {p.name_ar || p.name_en || p.code}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Flat list
            <div className="flex flex-wrap gap-2">
              {filtered.map((p) => (
                <span
                  key={p.id}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: theme.accentBlue }}
                >
                  {p.name_ar || p.name_en || p.code}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-gray-50 shrink-0 flex justify-end" style={{ borderColor: theme.border }}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-white border hover:bg-gray-100 transition-colors"
            style={{ borderColor: theme.border }}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteModal({
  pkg,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  pkg: Package;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-1">حذف الباقة</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                هل أنت متأكد من حذف باقة <span className="font-bold text-gray-800">"{pkg.name_en}"</span>؟
                سيتم إزالة هذه الباقة من جميع الموظفين المرتبطين بها. لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t" style={{ borderColor: theme.border }}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-white border hover:bg-gray-100 transition-colors disabled:opacity-40"
            style={{ borderColor: theme.border }}
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "جارٍ الحذف..." : "تأكيد الحذف"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({
  pkg,
  onSave,
  onCancel,
  isSaving,
}: {
  pkg: Package;
  onSave: (id: number, name: string, description: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(pkg.name_en);
  const [description, setDescription] = useState(pkg.description || "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) { setError("اسم الباقة مطلوب"); return; }
    onSave(pkg.id, name.trim(), description.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: theme.border }}>
          <h2 className="text-lg font-bold" style={{ color: theme.primaryDark }}>تعديل الباقة</h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">اسم الباقة *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{ borderColor: error ? "#EF4444" : theme.border }}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">الوصف <span className="text-gray-400 font-normal">(اختياري)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="وصف مختصر..."
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
              style={{ borderColor: theme.border }}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t" style={{ borderColor: theme.border }}>
          <button onClick={onCancel} disabled={isSaving} className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-white border hover:bg-gray-100 transition-colors disabled:opacity-40" style={{ borderColor: theme.border }}>
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            style={{ backgroundColor: theme.primaryDark }}
          >
            {isSaving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({
  pkg,
  onEdit,
  onDelete,
  onViewPrivileges,
}: {
  pkg: Package;
  onEdit: (pkg: Package) => void;
  onDelete: (pkg: Package) => void;
  onViewPrivileges: (pkg: Package) => void;
}) {
  const privCount = pkg.privileges?.length ?? 0;

  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden" style={{ borderColor: theme.border }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${theme.accentBlue}15` }}>
              <ShieldCheck className="w-5 h-5" style={{ color: theme.accentBlue }} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-base leading-tight truncate">{pkg.name_en}</p>
              {pkg.name_ar && pkg.name_ar !== pkg.name_en && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{pkg.name_ar}</p>
              )}
              <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-500">{pkg.code}</span>
              {pkg.description && (
                <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">{pkg.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onEdit(pkg)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border text-gray-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
              style={{ borderColor: theme.border }}
              title="تعديل"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(pkg)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border text-gray-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all"
              style={{ borderColor: theme.border }}
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Privilege count pill → click to open modal */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: theme.border }}>
          {privCount > 0 ? (
            <button
              onClick={() => onViewPrivileges(pkg)}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm"
              style={{
                borderColor: theme.accentBlue,
                color: theme.accentBlue,
                backgroundColor: `${theme.accentBlue}0f`,
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              عرض {privCount} صلاحية
            </button>
          ) : (
            <span className="text-xs text-gray-400">لا توجد صلاحيات مرتبطة</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PackageManagementPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const [editTarget, setEditTarget] = useState<Package | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Package | null>(null);
  const [viewTarget, setViewTarget] = useState<Package | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/staff/packages");
      const data: Package[] = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data) ? res.data : [];

      // Fetch privileges for each package in parallel
      const withPrivileges = await Promise.all(
        data.map(async (pkg) => {
          try {
            const privRes = await api.get(`/staff/packages/${pkg.id}/privileges`);
            const privData: Privilege[] = Array.isArray(privRes.data?.data)
              ? privRes.data.data
              : Array.isArray(privRes.data) ? privRes.data : [];
            return { ...pkg, privileges: privData };
          } catch {
            return { ...pkg, privileges: [] };
          }
        })
      );
      setPackages(withPrivileges);
    } catch {
      toast({ title: "خطأ", description: "تعذر تحميل الباقات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchPackages(); }, []);

  const handleEdit = async (id: number, name: string, description: string) => {
    setIsSaving(true);
    try {
      await api.put(`/staff/packages/${id}`, {
        name_en: name,
        name_ar: name,
        description: description || undefined,
      });
      toast({ title: "تم التعديل", description: "تم تحديث الباقة بنجاح" });
      setEditTarget(null);
      void fetchPackages();
    } catch {
      toast({ title: "خطأ", description: "تعذر تعديل الباقة", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/staff/packages/${deleteTarget.id}`);
      toast({ title: "تم الحذف", description: "تم حذف الباقة بنجاح" });
      setDeleteTarget(null);
      void fetchPackages();
    } catch {
      toast({ title: "خطأ", description: "تعذر حذف الباقة", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: theme.background }}>

      {/* Modals */}
      {viewTarget && (
        <PrivilegesModal pkg={viewTarget} onClose={() => setViewTarget(null)} />
      )}
      {deleteTarget && (
        <DeleteModal
          pkg={deleteTarget}
          onConfirm={() => void handleDelete()}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
      {editTarget && (
        <EditModal
          pkg={editTarget}
          onSave={handleEdit}
          onCancel={() => setEditTarget(null)}
          isSaving={isSaving}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: theme.border }}>
        <div>
          <h1 className="text-xl font-bold" style={{ color: theme.primaryDark }}>إدارة باقات الصلاحيات</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {loading ? "جارٍ التحميل..." : `${packages.length} باقة`}
          </p>
        </div>
        <button
          onClick={() => navigate("/staff/dashboard/admin/privilege-packages")}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-white shadow-md hover:opacity-90 transition-all"
          style={{ backgroundColor: theme.primaryDark }}
        >
          <Plus className="w-4 h-4" />
          إضافة باقة جديدة
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-white border animate-pulse" style={{ borderColor: theme.border }} />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${theme.accentBlue}15` }}>
              <ShieldCheck className="w-8 h-8" style={{ color: theme.accentBlue }} />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">لا توجد باقات بعد</h2>
            <p className="text-sm text-gray-400 mb-6">ابدأ بإنشاء أول باقة صلاحيات للموظفين</p>
            <button
              onClick={() => navigate("/staff/dashboard/admin/privilege-packages")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-md"
              style={{ backgroundColor: theme.primaryDark }}
            >
              <Plus className="w-4 h-4" />
              إنشاء باقة
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
                onViewPrivileges={setViewTarget}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
