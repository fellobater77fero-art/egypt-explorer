import { TouristPhrase } from '../types';

export const TOURIST_PHRASES: TouristPhrase[] = [
  // Courtesy & Greetings
  {
    category: 'courtesy',
    english: 'Hello / Welcome',
    arabicScript: 'أهلاً وسهلاً / مرحباً',
    masriPhonetic: 'Ahlan wa Sahlan / Marhaban',
    audioText: 'أهلاً وسهلاً، مرحباً بك في مصر',
  },
  {
    category: 'courtesy',
    english: 'Peace be upon you',
    arabicScript: 'السلام عليكم',
    masriPhonetic: 'As-salamu alaykum (Reply: Wa alaykum as-salam)',
    audioText: 'السلام عليكم',
  },
  {
    category: 'courtesy',
    english: 'Thank you very much',
    arabicScript: 'شكراً جزيلاً',
    masriPhonetic: 'Shukran gazeelan (Reply: Afwan)',
    audioText: 'شكراً جزيلاً',
  },
  {
    category: 'courtesy',
    english: 'Please / Excuse me',
    arabicScript: 'من فضلك / لو سمحت',
    masriPhonetic: 'Min fadlak (to m) / Min fadlik (to f) / Law samaht',
    audioText: 'لو سمحت من فضلك',
  },

  // Taxi & Transportation
  {
    category: 'taxi',
    english: 'Take me to the Pyramids, please',
    arabicScript: 'وصلني للأهرامات من فضلك',
    masriPhonetic: 'Wassalni lel-Ahramat min fadlak',
    audioText: 'وصلني للأهرامات من فضلك',
  },
  {
    category: 'taxi',
    english: 'Please turn on the meter',
    arabicScript: 'شغّل العداد لو سمحت',
    masriPhonetic: 'Shagh-ghal el-addad law samaht',
    audioText: 'شغل العداد لو سمحت',
  },
  {
    category: 'taxi',
    english: 'Stop here, thank you',
    arabicScript: 'على جنب هنا، شكراً',
    masriPhonetic: 'Ala ganb hena, shukran',
    audioText: 'على جنب هنا، شكراً',
  },
  {
    category: 'taxi',
    english: 'How much to Luxor Temple?',
    arabicScript: 'بكام المشوار لمعبد الأقصر؟',
    masriPhonetic: 'Bikam el-meshwar le-ma\'bad el-Uqsur?',
    audioText: 'بكام المشوار لمعبد الأقصر؟',
  },

  // Hotel & Accommodation
  {
    category: 'hotel',
    english: 'I have a room reservation',
    arabicScript: 'عندي حجز غرفة باسمي',
    masriPhonetic: 'Andi hagz ghorfa be-ismi',
    audioText: 'عندي حجز غرفة باسمي',
  },
  {
    category: 'hotel',
    english: 'What is the Wi-Fi password?',
    arabicScript: 'ما هي كلمة سر الواي فاي؟',
    masriPhonetic: 'Eh el-password bta\'et el-Wi-Fi?',
    audioText: 'إيه كلمة سر الواي فاي؟',
  },
  {
    category: 'hotel',
    english: 'Could you please call me a taxi?',
    arabicScript: 'ممكن تطلب لي تاكسي لو سمحت؟',
    masriPhonetic: 'Momken totlob li taxi law samaht?',
    audioText: 'ممكن تطلب لي تاكسي لو سمحت؟',
  },

  // Restaurant & Food
  {
    category: 'restaurant',
    english: 'The bill / check, please',
    arabicScript: 'الحساب من فضلك',
    masriPhonetic: 'El-Hesab min fadlak',
    audioText: 'الحساب من فضلك',
  },
  {
    category: 'restaurant',
    english: 'A bottle of mineral water, please',
    arabicScript: 'زجاجة مياه معدنية من فضلك',
    masriPhonetic: 'Ezazet mayya ma\'daneyya min fadlak',
    audioText: 'ازازة مية معدنية من فضلك',
  },
  {
    category: 'restaurant',
    english: 'Is this food spicy?',
    arabicScript: 'هل الأكل ده حار / حامي؟',
    masriPhonetic: 'Hal el-akl da har / hamy?',
    audioText: 'هل الأكل ده حار؟',
  },
  {
    category: 'restaurant',
    english: 'Delicious! Thank your hands (Bless you)',
    arabicScript: 'تسلم إيدك! الأكل لذيذ جداً',
    masriPhonetic: 'Teslam eedak! El-akl laziz giddan',
    audioText: 'تسلم إيدك، الأكل لذيذ جداً',
  },

  // Bazaar & Khan el-Khalili Bargaining
  {
    category: 'bazaar',
    english: 'How much is this?',
    arabicScript: 'بكام ده؟ / كم سعر هذا؟',
    masriPhonetic: 'Bikam da? / Kam se\'r hatha?',
    audioText: 'بكام ده؟',
  },
  {
    category: 'bazaar',
    english: 'This is too expensive! Can you reduce it?',
    arabicScript: 'غالي أوي! ممكن تخفّض شوية؟',
    masriPhonetic: 'Ghalli awi! Momken tekhaffad shewayya?',
    audioText: 'غالي قوي، ممكن تخفض شوية؟',
  },
  {
    category: 'bazaar',
    english: 'What is your final price?',
    arabicScript: 'إيه آخر سعر عندك؟',
    masriPhonetic: 'Eh akher se\'r andak?',
    audioText: 'إيه آخر سعر عندك؟',
  },
  {
    category: 'bazaar',
    english: 'Is this authentic handmade craft?',
    arabicScript: 'هل ده شغل يدوي أصلي؟',
    masriPhonetic: 'Hal da shoghl yadawi asli?',
    audioText: 'هل ده شغل يدوي أصلي؟',
  },

  // Emergency & Health
  {
    category: 'emergency',
    english: 'Please help me!',
    arabicScript: 'ساعدني من فضلك! / النجدة!',
    masriPhonetic: 'Sa\'edni min fadlak! / En-Nagda!',
    audioText: 'ساعدني من فضلك، النجدة',
  },
  {
    category: 'emergency',
    english: 'Where is the nearest hospital or pharmacy?',
    arabicScript: 'فين أقرب مستشفى أو صيدلية؟',
    masriPhonetic: 'Fein aqrab mostashfa aw saydaleyya?',
    audioText: 'فين أقرب مستشفى أو صيدلية؟',
  },
  {
    category: 'emergency',
    english: 'I need a doctor',
    arabicScript: 'أنا محتاج دكتور فوراً',
    masriPhonetic: 'Ana mehtag doctor fawran',
    audioText: 'أنا محتاج دكتور فوراً',
  },
];
