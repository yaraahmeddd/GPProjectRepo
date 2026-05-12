import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, UserCheck, Plane, Users, HeartHandshake } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RegisterFormValues } from '../schemas/validation';

interface Step1CategoryProps {
  onNext: () => void;
}

export const Step1Category = ({ onNext }: Step1CategoryProps) => {
  const { t } = useTranslation('registrations');
  const { watch, setValue } = useFormContext<RegisterFormValues>();
  const category = watch('category');

  const handleCategorySelect = (selectedCategory: RegisterFormValues['category']) => {
    setValue('category', selectedCategory);
    onNext();
  };

  const categories = [
    { id: 'staff' as const, icon: Briefcase, color: 'blue', title: t('category_cards.staff.title', 'University Staff'), desc: t('category_cards.staff.desc', 'Faculty members and employees') },
    { id: 'student' as const, icon: GraduationCap, color: 'emerald', title: t('category_cards.student.title', 'Student / Graduate'), desc: t('category_cards.student.desc', 'Students and graduates') },
    { id: 'retired' as const, icon: UserCheck, color: 'purple', title: t('category_cards.retired.title', 'Retired'), desc: t('category_cards.retired.desc', 'Retired faculty and employees') },
    { id: 'dependent' as const, icon: HeartHandshake, color: 'pink', title: t('category_cards.dependent.title', 'Dependent Member'), desc: t('category_cards.dependent.desc', 'Family members (spouse/children)') },
    { id: 'foreigner' as const, icon: Plane, color: 'orange', title: t('category_cards.foreigner.title', 'Foreigner / Seasonal'), desc: t('category_cards.foreigner.desc', 'Non-Egyptians (limited durations)') },
    { id: 'visitor' as const, icon: Users, color: 'gray', title: t('category_cards.visitor.title', 'Visitor Member'), desc: t('category_cards.visitor.desc', 'General memberships') },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {categories.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleCategorySelect(item.id)}
          className={`group relative flex flex-col items-center p-6 rounded-3xl transition-all duration-300 border-2 bg-white hover:shadow-xl hover:-translate-y-1 ${
            category === item.id ? 'border-[#2596be] ring-2 ring-[#2596be]/10 shadow-lg' : 'border-transparent shadow-sm hover:border-[#2596be]/40'
          }`}
        >
          <div className={`w-20 h-20 mb-4 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-${item.color}-50`}>
            <item.icon className={`w-10 h-10 text-${item.color}-600`} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
          <p className="text-gray-500 text-sm text-center leading-relaxed">{item.desc}</p>
        </button>
      ))}
    </motion.div>
  );
};
