import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, AlertCircle, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RegisterFormValues } from '../schemas/validation';
import { AuthService } from '../../../services/authService';

interface Step3DetailsProps {
    onNext: () => void;
    onPrev: () => void;
}

interface Faculty {
    id: number;
    code: string;
    name_en?: string;
    name_ar?: string;
}

interface Profession {
    id: number;
    code: string;
    name?: string;
    name_en?: string;
    name_ar?: string;
}

interface InputGroupProps {
    label: string;
    error?: FieldError;
    children: ReactNode;
    className?: string;
}

const InputGroup = ({ label, error, children, className = '' }: InputGroupProps) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {children}
        <AnimatePresence>
            {error && (
                <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-xs flex items-center gap-1 font-medium"
                >
                    <AlertCircle size={12} /> {error.message}
                </motion.span>
            )}
        </AnimatePresence>
    </div>
);

const NavigationButtons = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
    const { t, i18n } = useTranslation('registrations');
    const isRTL = i18n.resolvedLanguage?.startsWith('ar') || i18n.language?.startsWith('ar');
    return (
        <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
            <button onClick={onPrev} type="button" className="px-8 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors flex items-center gap-2">
                {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />} {t('actions.previous', 'Previous')}
            </button>
            <button onClick={onNext} type="button" className="px-8 py-3 rounded-xl bg-[#2596be] hover:bg-[#1a7a9a] text-white font-bold shadow-lg shadow-[#2596be]/20 transition-all flex items-center gap-2">
                {t('actions.next', 'Next')} {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
        </div>
    );
};

const getCategoryName = (cat: RegisterFormValues['category'] | undefined, t: (k: string, d?: string) => string): string => {
    switch (cat) {
        case 'student': return t('category_cards.student.title', 'Student / Graduate');
        case 'staff': return t('category_cards.staff.title', 'University Staff');
        case 'retired': return t('category_cards.retired.title', 'Retired');
        case 'foreigner': return t('category_cards.foreigner.title', 'Foreigner / Seasonal');
        case 'dependent': return t('category_cards.dependent.title', 'Dependent Member');
        case 'visitor': return t('category_cards.visitor.title', 'Visitor Member');
        default: return t('steps.membership_type', 'Membership Type');
    }
};

export const Step3Details = ({ onNext, onPrev }: Step3DetailsProps) => {
    const { t, i18n } = useTranslation('registrations');
    const isRTL = i18n.resolvedLanguage?.startsWith('ar') || i18n.language?.startsWith('ar');

    const { register, watch, formState: { errors } } = useFormContext<RegisterFormValues>();

    const category = watch('category');
    const selectedDuration = watch('seasonalDuration');

    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [professions, setProfessions] = useState<Profession[]>([]);

    const inputClasses = `
    w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 
    focus:bg-white focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 
    transition-all duration-200 outline-none placeholder:text-gray-400 text-gray-800
  `;

    useEffect(() => {
        const loadData = async () => {
            try {
                const [facRes, proRes] = await Promise.all([
                    AuthService.getFaculties(),
                    AuthService.getProfessions(),
                ]);

                const facultiesData = Array.isArray(facRes?.data) ? facRes.data : Array.isArray(facRes) ? facRes : [];
                const professionsData = Array.isArray(proRes?.data) ? proRes.data : Array.isArray(proRes) ? proRes : [];

                setFaculties(facultiesData);
                setProfessions(professionsData);
            } catch (error) {
                console.error('Failed to fetch registration lists:', error);
                setFaculties([]);
                setProfessions([]);
            }
        };

        void loadData();
    }, []);

    const facultyName = (f: Faculty) => (isRTL ? (f.name_ar || f.name_en || String(f.id)) : (f.name_en || f.name_ar || String(f.id)));
    const professionName = (p: Profession) => (isRTL ? (p.name_ar || p.name || p.name_en || p.code) : (p.name_en || p.name || p.name_ar || p.code));

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-[#1a5f7a] mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#e8f4f8] rounded-lg">
                    <Building2 className="text-[#2596be]" />
                </div>
                {t('details.title', 'Membership Details')}{' '}
                <span className="text-gray-400 text-lg font-normal">({getCategoryName(category, t)})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <InputGroup label={t('details.address', 'Current Address in Detail')} error={errors.address}>
                        <input {...register('address')} className={inputClasses} />
                    </InputGroup>
                </div>

                {category === 'student' && (
                    <>
                        <InputGroup label={t('details.faculty', 'Faculty')} error={errors.facultyId}>
                            <select {...register('facultyId')} className={inputClasses}>
                                <option value="">{t('details.select_faculty', 'Select faculty')}</option>
                                {faculties.map((f) => (
                                    <option key={f.id} value={f.id}>{facultyName(f)}</option>
                                ))}
                            </select>
                        </InputGroup>

                        <InputGroup label={t('details.graduation_year', 'Graduation Year')} error={errors.graduationYear}>
                            <input type="number" {...register('graduationYear')} className={inputClasses} placeholder="YYYY" />
                        </InputGroup>
                    </>
                )}

                {category === 'staff' && (
                    <>
                        <InputGroup label={t('details.job_grade', 'Job Grade')} error={errors.professionId}>
                            <select {...register('professionId')} className={inputClasses}>
                                <option value="">{t('details.select_profession', 'Select profession')}</option>
                                {professions.map((p) => (
                                    <option key={p.id} value={p.id}>{professionName(p)}</option>
                                ))}
                            </select>
                        </InputGroup>

                        <InputGroup label={t('details.department', 'Department / Administration')} error={errors.department}>
                            <input {...register('department')} className={inputClasses} />
                        </InputGroup>

                        <div className="md:col-span-2 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                            <InputGroup label={t('details.salary', 'Monthly Salary')} error={errors.salary}>
                                <div className="relative">
                                    <input type="number" {...register('salary')} className={`${inputClasses} bg-white`} placeholder="0.00" />
                                    <span className="absolute left-4 top-3 text-gray-400 text-sm font-bold">EGP</span>
                                </div>
                            </InputGroup>
                            <p className="text-sm text-blue-600 mt-3 flex items-center gap-2">
                                <AlertCircle size={16} /> {t('details.salary_note', 'Annual subscription fees are determined based on salary bracket.')}
                            </p>
                        </div>
                    </>
                )}

                {category === 'retired' && (
                    <>
                        <InputGroup label={t('details.retired_department', 'Department before retirement')} error={errors.department}>
                            <input type="text" placeholder={isRTL ? 'مثال: الهندسة الكهربائية' : 'e.g. Electrical Engineering'} {...register('department')} className={inputClasses} />
                        </InputGroup>

                        <InputGroup label={t('details.retirement_date', 'Retirement Date')} error={errors.retirementDate}>
                            <input type="date" {...register('retirementDate')} className={inputClasses} />
                        </InputGroup>

                        <InputGroup label={t('details.retired_last_salary', 'Last salary before retirement (optional)')} error={errors.salary}>
                            <input type="number" {...register('salary')} className={inputClasses} />
                        </InputGroup>

                        <InputGroup label={t('details.retired_profession', 'Profession before retirement (optional)')} error={errors.professionCode}>
                            <select {...register('professionCode')} className={inputClasses}>
                                <option value="">{t('details.select_profession', 'Select profession')}</option>
                                {professions.map((p) => (
                                    <option key={p.id} value={p.code || p.id}>{professionName(p)}</option>
                                ))}
                            </select>
                        </InputGroup>
                    </>
                )}

                {category === 'foreigner' && (
                    <>
                        <InputGroup label={t('details.duration', 'Membership Duration')} error={errors.seasonalDuration}>
                            <select {...register('seasonalDuration')} className={inputClasses}>
                                <option value="1">{t('details.one_month', '1 month')}</option>
                                <option value="6">{t('details.six_months', '6 months')}</option>
                                <option value="12">{t('details.one_year', '1 year')}</option>
                            </select>
                        </InputGroup>

                        <InputGroup label={t('details.visa_status', 'Visa Status')} error={errors.visaStatus}>
                            <select {...register('visaStatus')} className={inputClasses}>
                                <option value="valid">{t('details.visa_valid', 'Valid')}</option>
                                <option value="pending">{t('details.visa_pending', 'Pending')}</option>
                            </select>
                        </InputGroup>

                        {selectedDuration === '12' && (
                            <div className="md:col-span-2 text-sm text-green-700 bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-2">
                                <Check size={18} className="text-green-600" />
                                {t('details.installment_note', 'Installment payment (2 installments) is available for this subscription.')}
                            </div>
                        )}
                    </>
                )}

                {category === 'dependent' && (
                    <>
                        <InputGroup label={t('details.primary_member_id', 'Primary Member ID')} className="md:col-span-2" error={errors.relatedMemberId}>
                            <input {...register('relatedMemberId')} className={inputClasses} placeholder={t('details.primary_member_id_placeholder', 'Membership ID or National ID')} />
                        </InputGroup>

                        <InputGroup label={t('details.relationship', 'Relationship')} error={errors.relationshipType}>
                            <select {...register('relationshipType')} className={inputClasses}>
                                <option value="spouse">{t('details.spouse', 'Spouse')}</option>
                                <option value="child">{t('details.child', 'Child')}</option>
                                <option value="parent">{t('details.parent', 'Parent')}</option>
                            </select>
                        </InputGroup>

                        <div className="md:col-span-2 text-sm text-[#2596be] bg-[#e8f4f8] p-4 rounded-xl border border-[#2596be]/20 flex items-center gap-2">
                            <Check size={18} /> {t('details.dependent_discount', 'A dependent discount (40%) will be applied to the subscription value.')}
                        </div>
                    </>
                )}

                {category === 'visitor' && (
                    <div className="md:col-span-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-2">
                        <Check size={18} className="text-gray-500" />
                        {t('details.visitor_note', 'General membership - fees are determined after evaluation.')}
                    </div>
                )}
            </div>

            <NavigationButtons onPrev={onPrev} onNext={onNext} />
        </motion.div>
    );
};
