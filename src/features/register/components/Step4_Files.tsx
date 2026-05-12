import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Check, UploadCloud, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RegisterFormValues } from '../schemas/validation';
import type { FileUploadMap } from '../utils/submissionFactory';

interface Step4FilesProps {
  files: FileUploadMap;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, key: keyof FileUploadMap) => void;
  onPrev: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
}

const FileBox = ({
  label,
  id,
  files,
  refs,
  onChange,
  hint,
}: {
  label: string;
  id: keyof FileUploadMap;
  files: FileUploadMap;
  refs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: keyof FileUploadMap) => void;
  hint: string;
}) => (
  <div
    onClick={() => refs.current[id]?.click()}
    className={`relative border-2 border-dashed p-5 rounded-2xl min-h-[160px] cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center text-center ${
      files[id] ? 'border-[#2596be] bg-[#e8f4f8]/50' : 'border-gray-200 bg-gray-50 hover:border-[#2596be]/50 hover:bg-white'
    }`}
  >
    <input
      type="file"
      hidden
      ref={(el) => {
        refs.current[id] = el;
      }}
      onChange={(e) => onChange(e, id)}
      accept="image/*,application/pdf"
    />

    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${files[id] ? 'bg-[#e8f4f8] text-[#2596be]' : 'bg-gray-200 text-gray-500 group-hover:bg-[#e8f4f8] group-hover:text-[#2596be]'}`}>
      {files[id] ? <Check size={24} /> : <UploadCloud size={24} />}
    </div>

    <p className={`font-bold text-base ${files[id] ? 'text-[#1a5f7a]' : 'text-gray-600'}`}>{label}</p>
    <p className="text-sm text-gray-400 mt-1 max-w-[180px] truncate">{files[id] ? files[id].name : hint}</p>
  </div>
);

export const Step4Files = ({ files, onFileChange, onPrev, onSubmit, isSubmitting }: Step4FilesProps) => {
  const { t, i18n } = useTranslation('registrations');
  const isRTL = i18n.resolvedLanguage?.startsWith('ar') || i18n.language?.startsWith('ar');
  const { watch } = useFormContext<RegisterFormValues>();
  const category = watch('category');
  const memberRole = watch('memberRole');
  const fileRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const isTeamMember = memberRole === 'sports_player';
  const hint = t('files.upload_hint', 'Click to upload file (PDF, JPG)');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-xl p-6 md:p-7 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1a5f7a] mb-5 text-center">{t('files.title', 'Attachments & Documents')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isTeamMember ? (
          <>
            <FileBox label={`${t('files.photo', 'Recent Personal Photo')} *`} id="photo" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />
            <FileBox label={`${t('files.id_front', 'National ID (Front)')} *`} id="id_front" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />
            <FileBox label={`${t('files.id_back', 'National ID (Back)')} *`} id="id_back" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />
            <FileBox label={`${t('files.proof', 'Proof Document')} *`} id="proof" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />
            <FileBox label={t('files.medical', 'Medical Report')} id="medical" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />
          </>
        ) : (
          <>
            <FileBox label={t('files.photo', 'Recent Personal Photo')} id="photo" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />
            {category === 'foreigner' ? (
              <FileBox label={t('files.passport', 'Passport Copy')} id="passport" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />
            ) : (
              <>
                <FileBox label={t('files.id_front', 'National ID (Front)')} id="id_front" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />
                <FileBox label={t('files.id_back', 'National ID (Back)')} id="id_back" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />
              </>
            )}
            {(category === 'staff' || category === 'retired') && <FileBox label={t('files.salary_slip', 'Salary Slip / Pension Statement')} id="salary_slip" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />}
            {category === 'student' && <FileBox label={t('files.student_proof', 'Enrollment Proof / Graduation Certificate')} id="student_proof" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />}
            {category === 'dependent' && <FileBox label={t('files.relation_proof', 'Relationship Proof')} id="relation_proof" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />}
            <FileBox label={t('files.medical', 'Medical Report')} id="medical" files={files} refs={fileRefs} onChange={onFileChange} hint={hint} />
          </>
        )}
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-between mt-6 gap-3">
        <button onClick={onPrev} type="button" className="px-7 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors flex items-center justify-center gap-2">
          {isRTL ? <ChevronRight size={20} /> : <ChevronRight size={20} className="rotate-180" />} {t('actions.previous', 'Previous')}
        </button>
        <button onClick={onSubmit} disabled={isSubmitting} type="button" className="flex-1 md:flex-none px-9 py-2.5 rounded-xl bg-[#2596be] hover:bg-[#1a7a9a] text-white font-bold shadow-lg shadow-[#2596be]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={24} />}
          {isSubmitting ? t('actions.processing', 'Processing...') : t('actions.confirm_registration', 'Confirm Registration')}
        </button>
      </div>
    </motion.div>
  );
};
