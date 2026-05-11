import { Controller, useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RegisterFormValues, MemberRole } from '../schemas/validation';

const Step0_RoleSelection = () => {
  const { t } = useTranslation('registrations');
  const { control, formState: { errors } } = useFormContext<RegisterFormValues>();

  const roleOptions: {
    id: MemberRole;
    title: string;
    subtitle: string;
    description: string;
    icon: typeof Users;
    features: string[];
  }[] = [
    {
      id: 'social_member',
      title: t('role.social.title', 'Club Member'),
      subtitle: t('role.social.subtitle', 'Social Member'),
      description: t('role.social.description', 'Enjoy all social and recreational club facilities'),
      icon: Users,
      features: t('role.social.features', { returnObjects: true, defaultValue: ['Social Facilities', 'Swimming Pool', 'Cafeteria', 'Gardens'] }) as string[],
    },
    {
      id: 'sports_player',
      title: t('role.player.title', 'Player'),
      subtitle: t('role.player.subtitle', 'Sports Player'),
      description: t('role.player.description', 'Join club teams and pursue your favorite sport'),
      icon: Trophy,
      features: t('role.player.features', { returnObjects: true, defaultValue: ['Training', 'Competitions', 'Coaches', 'Tournaments'] }) as string[],
    },
  ];

  return (
    <Controller
      name="memberRole"
      control={control}
      render={({ field }) => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
          <div className="text-center mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-[#1a5f7a] mb-1">{t('role.title', 'Choose Membership Type')}</h2>
            <p className="text-gray-500 text-xs md:text-sm">{t('role.subtitle', 'Select the membership type that suits you')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roleOptions.map((option) => {
              const isSelected = field.value === option.id;
              const Icon = option.icon;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => field.onChange(option.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 md:p-5 rounded-3xl border-4 transition-all duration-300 text-right cursor-pointer ${
                    isSelected ? 'border-[#2596be] bg-[#e8f4f8] shadow-2xl ring-4 ring-[#2596be]/20' : 'border-gray-200 bg-white hover:border-gray-300 shadow-xl'
                  }`}
                >
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">✓</span>
                    </motion.div>
                  )}

                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${isSelected ? 'bg-[#e8f4f8] text-[#2596be]' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon size={28} />
                  </div>

                  <h3 className={`text-lg md:text-xl font-bold mb-1 ${isSelected ? 'text-[#1a5f7a]' : 'text-gray-800'}`}>{option.title}</h3>
                  <p className="text-xs text-gray-400 mb-3">{option.subtitle}</p>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {option.features.map((feature) => (
                      <span key={feature} className={`text-xs px-2.5 py-1 rounded-full ${isSelected ? 'bg-[#e8f4f8] text-[#2596be]' : 'bg-gray-100 text-gray-600'}`}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {errors.memberRole && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 text-red-500 text-sm">
                <AlertCircle size={16} />
                <span>{errors.memberRole.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {field.value === 'sports_player' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#2596be]/10 border border-[#2596be]/20 rounded-2xl p-3 text-[#1a5f7a] text-sm text-center">
                {t('role.player_note', 'You can join sports teams from your dashboard after completing registration')}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    />
  );
};

export default Step0_RoleSelection;
