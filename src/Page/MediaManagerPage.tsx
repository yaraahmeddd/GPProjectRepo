import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { CloudUpload, Search, Image as ImageIcon, Video, FileText, Edit2, Trash2, Calendar, X, Plus, UploadCloud, AlertTriangle } from 'lucide-react';
import { CustomDatePicker } from '../Component/StaffPagesComponents/ui/CustomDatePicker';

interface MediaPost {
    id: string;
    title: string;
    description: string;
    category: "صور" | "فيديو" | "فعاليات" | "عرض ترويجي" | "حدث" | "إعلان" | "أخبار" | "الصيانة";
    images?: string[];
    videoUrl?: string;
    date: string;
}

const BACKEND_URL = "http://localhost:3000";

// --- Create/Edit Modal Component ---
interface CreateMediaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editPost?: MediaPost | null;
}

const CreateMediaModal: React.FC<CreateMediaModalProps> = ({ isOpen, onClose, onSuccess, editPost }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'صور' as MediaPost['category'],
        date: new Date().toISOString().split('T')[0] // Default to today
    });
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ title?: string; media?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editPost) {
            let formattedDate = new Date().toISOString().split('T')[0];
            if (editPost.date) {
                const parsedDate = new Date(editPost.date);
                if (!isNaN(parsedDate.getTime())) {
                    formattedDate = parsedDate.toISOString().split('T')[0];
                }
            }

            setFormData({
                title: editPost.title,
                description: editPost.description || '',
                category: editPost.category,
                date: formattedDate
            });
            // Handle existing image (take only the first one if multiple exist)
            setExistingImages(editPost.images && editPost.images.length > 0 ? [editPost.images[0]] : []);
            setUploadedImages([]);
            setPreviewImages([]);
            setVideoUrl(editPost.videoUrl || '');
        } else {
            setFormData({ title: '', description: '', category: 'صور', date: new Date().toISOString().split('T')[0] });
            setExistingImages([]);
            setUploadedImages([]);
            setPreviewImages([]);
            setVideoUrl('');
            setVideoFile(null);
            setErrors({});
        }
    }, [editPost, isOpen]);

    if (!isOpen) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedImages([file]);
            setPreviewImages([URL.createObjectURL(file)]);
            setExistingImages([]); // Enforce max 1 image
            setErrors(prev => ({ ...prev, media: undefined }));
        }
        // Reset input value so the same file can be selected again if needed
        e.target.value = '';
    };

    const handleRemoveMedia = () => {
        setPreviewImages([]);
        setUploadedImages([]);
        setExistingImages([]);
    };

    const handleSubmit = async () => {
        const newErrors: { title?: string; media?: string } = {};
        if (!formData.title.trim()) newErrors.title = 'العنوان مطلوب';
        if (formData.category !== 'فيديو' && uploadedImages.length === 0 && existingImages.length === 0) {
            newErrors.media = 'يجب تحميل صورة واحدة على الأقل';
        }
        if (formData.category === 'فيديو' && !videoUrl.trim() && !videoFile) {
            newErrors.media = 'يجب إدخال رابط الفيديو أو رفع ملف';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('date', formData.date); // Allow date edit
            data.append('videoUrl', videoUrl);

            uploadedImages.forEach(file => data.append('images', file));

            if (editPost) {
                existingImages.forEach(img => data.append('existingImages', img));
                await api.put(`/media-posts/${editPost.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/media-posts', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save media post:', error);
            alert('فشل في حفظ المنشور');
        } finally {
            setIsSubmitting(false);
        }
    };

    const combinedImages = [...existingImages.map(img => img.startsWith('http') ? img : `${BACKEND_URL}/${img}`), ...previewImages];

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto p-4 sm:p-6" dir="rtl">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto my-8 flex flex-col font-['Cairo']">
                
                {/* Header matching the image layout */}
                <div className="p-8 pb-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">
                        {editPost ? 'تعديل المنشور' : 'إضافة وسائط جديدة'}
                    </h2>
                    <p className="text-gray-500 text-[0.95rem]">
                        {editPost ? 'قم بتحديث بيانات ملف الوسائط.' : 'قم برفع وإعداد ملف الوسائط الجديد للمكتبة.'}
                    </p>
                </div>

                <div className="p-8 pt-4">
                    <div className="border border-gray-200 rounded-xl p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                            
                            {/* Right Side (Upload Box) - RTL so it's on the right */}
                            <div className="lg:col-span-5 flex flex-col">
                                {formData.category !== 'فيديو' ? (
                                    <>
                                        {combinedImages.length > 0 ? (
                                            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 group shadow-sm bg-gray-50">
                                                <img src={combinedImages[0]} alt="preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleRemoveMedia();
                                                        }}
                                                        className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg transform hover:scale-105"
                                                    >
                                                        <Trash2 size={18} /> حذف الصورة
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full aspect-square md:aspect-[4/3] border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-[#2596be] transition-all group relative bg-white">
                                                <div className="flex flex-col items-center justify-center p-6 text-center">
                                                    <div className="w-16 h-16 bg-[#2596be] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                                                        <UploadCloud size={28} className="text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1">انقر للرفع</h3>
                                                    <p className="text-sm text-gray-500 mb-4">أو قم بسحب وإفلات الملف هنا</p>
                                                    <p className="text-xs text-gray-400 font-medium">MP4, MOV, JPG, PNG حتى 2 جيجابايت</p>
                                                </div>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            </label>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col justify-center h-full space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <label className="block text-sm font-bold text-gray-700">رابط الفيديو (YouTube/Vimeo)</label>
                                        <input
                                            type="text"
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#2596be] focus:ring-2 focus:ring-[#2596be]/20"
                                            placeholder="https://..."
                                        />
                                        <div className="text-center relative py-2">
                                            <span className="bg-gray-50 px-3 relative z-10 text-xs font-bold text-gray-400">أو رفع ملف</span>
                                            <div className="absolute top-1/2 inset-x-0 h-px bg-gray-200"></div>
                                        </div>
                                        <input type="file" accept="video/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setVideoFile(file); setErrors(prev => ({ ...prev, media: undefined })); } }} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#2596be]/10 file:text-[#2596be] hover:file:bg-[#2596be]/20 transition-all cursor-pointer" />
                                    </div>
                                )}
                                {errors.media && <p className="mt-2 text-sm text-red-500 font-medium">{errors.media}</p>}
                            </div>

                            {/* Left Side (Form Fields) */}
                            <div className="lg:col-span-7 flex flex-col space-y-6">
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">العنوان <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => { setFormData(prev => ({ ...prev, title: e.target.value })); setErrors(prev => ({ ...prev, title: undefined })); }}
                                        className={`w-full px-4 py-3 bg-white border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg outline-none focus:border-[#2596be] focus:ring-2 focus:ring-[#2596be]/20 transition-all`}
                                        placeholder="أدخل عنوان الوسائط"
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">الفئة <span className="text-red-500">*</span></label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => { setFormData(prev => ({ ...prev, category: e.target.value as any })); setUploadedImages([]); setPreviewImages([]); setErrors({}); }}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#2596be] focus:ring-2 focus:ring-[#2596be]/20 transition-all appearance-none"
                                        >
                                            <option value="صور">صور</option>
                                            <option value="فيديو">فيديو</option>
                                            <option value="فعاليات">فعاليات</option>
                                            <option value="عرض ترويجي">عرض ترويجي</option>
                                            <option value="حدث">حدث</option>
                                            <option value="إعلان">إعلان</option>
                                            <option value="أخبار">أخبار</option>
                                            <option value="الصيانة">الصيانة</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">التاريخ</label>
                                        <CustomDatePicker 
                                            value={formData.date}
                                            onChange={(date) => setFormData(prev => ({ ...prev, date }))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">الوصف</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#2596be] focus:ring-2 focus:ring-[#2596be]/20 transition-all resize-none"
                                        placeholder="وصف إضافي (اختياري)..."
                                    />
                                </div>
                                
                                {/* Action Buttons at bottom right of form area */}
                                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-[#2596be] text-white font-bold rounded-lg hover:bg-[#1e7a9c] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                                        حفظ الوسائط
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const MediaManagerPage: React.FC = () => {
    const [posts, setPosts] = useState<MediaPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<MediaPost | null>(null);
    
    // Delete Confirmation State
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const ITEMS_PER_PAGE = 8;

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/media-posts');
            if (response.data.success) {
                setPosts(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        setIsDeleting(true);
        try {
            await api.delete(`/media-posts/${deleteConfirmId}`);
            fetchPosts(); // Refresh list
            setDeleteConfirmId(null);
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('حدث خطأ أثناء الحذف');
        } finally {
            setIsDeleting(false);
        }
    };

    const normalizeImage = (post: MediaPost) => {
        const img = post.images?.[0];
        if (!img) return null;
        return img.startsWith('http') ? img : `${BACKEND_URL}/${img}`;
    };

    const getIconForCategory = (category: string) => {
        if (category === 'فيديو') return <Video size={14} className="text-gray-900" />;
        if (category === 'مستندات' || category === 'أخبار') return <FileText size={14} className="text-gray-900" />;
        return <ImageIcon size={14} className="text-gray-900" />;
    };

    const filters = [
        { id: 'all', label: 'الكل' },
        { id: 'صور', label: 'صور' },
        { id: 'فيديو', label: 'فيديو' },
        { id: 'فعاليات', label: 'فعاليات' },
        { id: 'أخبار', label: 'أخبار' }
    ];

    const filteredPosts = posts.filter(post => {
        const matchesCategory = activeFilter === 'all' || post.category === activeFilter;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              post.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, searchQuery]);

    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE, 
        currentPage * ITEMS_PER_PAGE
    );

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return new Intl.DateTimeFormat('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-['Cairo'] pb-24" dir="rtl">
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
                
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in-down { animation: fadeInDown 0.6s ease-out; }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out 0.1s both; }
                
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
            
            <div className="max-w-7xl mx-auto px-6 py-8 md:px-12 md:py-10">
                
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 animate-fade-in-down">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
                            إدارة الوسائط
                        </h1>
                        <p className="text-[0.95rem] text-gray-500 font-medium">
                            إدارة وتنظيم ملفات الوسائط الخاصة بناديك.
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => { setEditingPost(null); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-3 bg-[#2596be] hover:bg-[#1e7a9c] text-white rounded-md px-6 py-3 w-full sm:w-auto transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <CloudUpload size={20} />
                        <span className="font-medium text-base">رفع وسائط</span>
                    </button>
                </header>

                {/* Controls Bar (Search & Filter) */}
                <div className="bg-white p-2 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row justify-between items-center gap-4 mb-12 animate-fade-in-up">
                    
                    {/* Search */}
                    <div className="relative w-full md:max-w-[400px] flex items-center px-4">
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <Search size={20} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="البحث في الملفات..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-10 pl-4 py-3 bg-transparent text-[0.95rem] text-gray-900 focus:outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {/* Divider for desktop */}
                    <div className="hidden md:block w-px h-8 bg-gray-200"></div>

                    {/* Filters */}
                    <div className="flex overflow-x-auto w-full md:w-auto px-2 pb-2 md:pb-0 gap-1 hide-scrollbar">
                        {filters.map((filter) => (
                            <button 
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`whitespace-nowrap px-5 py-2.5 rounded-md text-[0.95rem] font-medium transition-all ${
                                    activeFilter === filter.id 
                                    ? 'bg-[#234573] text-white shadow-sm' 
                                    : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Media Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                                <div className="aspect-[4/3] bg-gray-100 animate-pulse w-full"></div>
                                <div className="p-5 border-t border-gray-100 flex flex-col gap-3">
                                    <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4"></div>
                                    <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-32 flex flex-col items-center">
                        <ImageIcon size={48} className="text-gray-300 mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-1">لا توجد وسائط</h2>
                        <p className="text-gray-500 text-sm">عد لاحقاً أو جرب تعديل بحثك.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                            {paginatedPosts.map((post, index) => {
                                const imgUrl = normalizeImage(post);
                                return (
                                    <article 
                                        key={post.id} 
                                        className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400 group relative flex flex-col"
                                        style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both` }}
                                    >
                                        
                                        {/* Media Wrapper */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {imgUrl ? (
                                                <img 
                                                    src={imgUrl} 
                                                    alt={post.title} 
                                                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110" 
                                                />
                                            ) : (
                                                <ImageIcon size={48} className="text-gray-300" />
                                            )}
                                            
                                            {/* Badge */}
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 z-20">
                                                {getIconForCategory(post.category)}
                                                <span className="text-xs font-semibold text-gray-900 uppercase">{post.category}</span>
                                            </div>

                                            {/* Gradient Overlay for Actions */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10 pointer-events-none"></div>

                                            {/* Hover Actions (Edit & Delete) */}
                                            <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                                                <button 
                                                    onClick={() => { setEditingPost(post); setIsModalOpen(true); }}
                                                    title="تعديل"
                                                    className="w-9 h-9 rounded-full bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center transition-all duration-300 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                                                    style={{ transitionDelay: '0.05s' }}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => setDeleteConfirmId(post.id)}
                                                    title="حذف"
                                                    className="w-9 h-9 rounded-full bg-rose-600 text-white hover:bg-rose-700 flex items-center justify-center transition-all duration-300 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-sm"
                                                    style={{ transitionDelay: '0.1s' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Info */}
                                        <div className="p-5 border-t border-gray-200">
                                            <h3 className="text-[1.05rem] font-semibold text-gray-900 mb-1.5 truncate">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-gray-500 text-[0.8rem]">
                                                <Calendar size={14} />
                                                <time>{formatDate(post.date)}</time>
                                            </div>
                                        </div>

                                    </article>
                                );
                            })}
                        </div>
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-md font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                >
                                    السابق
                                </button>
                                
                                <div className="flex gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded-md font-bold text-sm transition-all flex items-center justify-center ${
                                                currentPage === i + 1
                                                ? 'bg-[#2596be] text-white shadow-sm'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-md font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                >
                                    التالي
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal Injection */}
            <CreateMediaModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPosts}
                editPost={editingPost}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6" dir="rtl">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteConfirmId(null)} />
                    
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-auto flex flex-col overflow-hidden font-['Cairo'] animate-fade-in-up">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-inner">
                                <AlertTriangle size={28} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">تأكيد الحذف</h3>
                            <p className="text-gray-500 text-[0.95rem]">
                                هل أنت متأكد أنك تريد حذف هذه الوسائط؟ لا يمكن التراجع عن هذا الإجراء.
                            </p>
                        </div>
                        <div className="p-6 pt-0 flex gap-3">
                            <button 
                                onClick={() => setDeleteConfirmId(null)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button 
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex justify-center items-center gap-2 shadow-sm"
                            >
                                {isDeleting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                                نعم، احذف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaManagerPage;
