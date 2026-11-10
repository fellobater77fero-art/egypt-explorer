export interface GovernorateInfo {
  id: string;
  nameEn: string;
  nameAr: string;
  capitalEn: string;
  capitalAr: string;
  region: 'greater_cairo' | 'alexandria_delta' | 'canal' | 'upper_egypt' | 'frontier';
}

export const ALL_GOVERNORATES: GovernorateInfo[] = [
  // Greater Cairo
  { id: 'cairo', nameEn: 'Cairo', nameAr: 'القاهرة', capitalEn: 'Cairo', capitalAr: 'القاهرة', region: 'greater_cairo' },
  { id: 'giza', nameEn: 'Giza', nameAr: 'الجيزة', capitalEn: 'Giza', capitalAr: 'الجيزة', region: 'greater_cairo' },
  { id: 'qalyubia', nameEn: 'Qalyubia', nameAr: 'القليوبية', capitalEn: 'Banha', capitalAr: 'بنها', region: 'greater_cairo' },

  // Alexandria & Nile Delta
  { id: 'alexandria', nameEn: 'Alexandria', nameAr: 'الإسكندرية', capitalEn: 'Alexandria', capitalAr: 'الإسكندرية', region: 'alexandria_delta' },
  { id: 'beheira', nameEn: 'Beheira', nameAr: 'البحيرة', capitalEn: 'Damanhur', capitalAr: 'دمنهور', region: 'alexandria_delta' },
  { id: 'matrouh', nameEn: 'Matrouh', nameAr: 'مطروح', capitalEn: 'Marsa Matruh', capitalAr: 'مرسى مطروح', region: 'frontier' },
  { id: 'damietta', nameEn: 'Damietta', nameAr: 'دمياط', capitalEn: 'Damietta', capitalAr: 'دمياط', region: 'alexandria_delta' },
  { id: 'dakahlia', nameEn: 'Dakahlia', nameAr: 'الدقهلية', capitalEn: 'Mansoura', capitalAr: 'المنصورة', region: 'alexandria_delta' },
  { id: 'kafr_el_sheikh', nameEn: 'Kafr El Sheikh', nameAr: 'كفر الشيخ', capitalEn: 'Kafr El Sheikh', capitalAr: 'كفر الشيخ', region: 'alexandria_delta' },
  { id: 'gharbia', nameEn: 'Gharbia', nameAr: 'الغربية', capitalEn: 'Tanta', capitalAr: 'طنطا', region: 'alexandria_delta' },
  { id: 'monufia', nameEn: 'Monufia', nameAr: 'المنوفية', capitalEn: 'Shibin El Kom', capitalAr: 'شبين الكوم', region: 'alexandria_delta' },
  { id: 'sharqia', nameEn: 'Sharqia', nameAr: 'الشرقية', capitalEn: 'Zagazig', capitalAr: 'الزقازيق', region: 'alexandria_delta' },

  // Suez Canal & Sinai
  { id: 'port_said', nameEn: 'Port Said', nameAr: 'بورسعيد', capitalEn: 'Port Said', capitalAr: 'بورسعيد', region: 'canal' },
  { id: 'ismailia', nameEn: 'Ismailia', nameAr: 'الإسماعيلية', capitalEn: 'Ismailia', capitalAr: 'الإسماعيلية', region: 'canal' },
  { id: 'suez', nameEn: 'Suez', nameAr: 'السويس', capitalEn: 'Suez', capitalAr: 'السويس', region: 'canal' },
  { id: 'north_sinai', nameEn: 'North Sinai', nameAr: 'شمال سيناء', capitalEn: 'Arish', capitalAr: 'العريش', region: 'frontier' },
  { id: 'south_sinai', nameEn: 'South Sinai', nameAr: 'جنوب سيناء', capitalEn: 'El Tor', capitalAr: 'الطور', region: 'frontier' },

  // Upper Egypt (Nile Valley)
  { id: 'fayoum', nameEn: 'Fayoum', nameAr: 'الفيوم', capitalEn: 'Fayoum', capitalAr: 'الفيوم', region: 'upper_egypt' },
  { id: 'beni_suef', nameEn: 'Beni Suef', nameAr: 'بني سويف', capitalEn: 'Beni Suef', capitalAr: 'بني سويف', region: 'upper_egypt' },
  { id: 'minya', nameEn: 'Minya', nameAr: 'المنيا', capitalEn: 'Minya', capitalAr: 'المنيا', region: 'upper_egypt' },
  { id: 'asyut', nameEn: 'Asyut', nameAr: 'أسيوط', capitalEn: 'Asyut', capitalAr: 'أسيوط', region: 'upper_egypt' },
  { id: 'sohag', nameEn: 'Sohag', nameAr: 'سوهاج', capitalEn: 'Sohag', capitalAr: 'سوهاج', region: 'upper_egypt' },
  { id: 'qena', nameEn: 'Qena', nameAr: 'قنا', capitalEn: 'Qena', capitalAr: 'قنا', region: 'upper_egypt' },
  { id: 'luxor', nameEn: 'Luxor', nameAr: 'الأقصر', capitalEn: 'Luxor', capitalAr: 'الأقصر', region: 'upper_egypt' },
  { id: 'aswan', nameEn: 'Aswan', nameAr: 'أسوان', capitalEn: 'Aswan', capitalAr: 'أسوان', region: 'upper_egypt' },

  // Red Sea & Western Desert
  { id: 'red_sea', nameEn: 'Red Sea', nameAr: 'البحر الأحمر', capitalEn: 'Hurghada', capitalAr: 'الغردقة', region: 'frontier' },
  { id: 'new_valley', nameEn: 'New Valley', nameAr: 'الوادي الجديد', capitalEn: 'Kharga', capitalAr: 'الخارجة', region: 'frontier' },
];
