export type Language = "en" | "hi" | "mr";

export interface Translation {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

export const translations: Translation = {
  // Navbar
  "nav.home": {
    en: "Home",
    hi: "होम",
    mr: "मुख्यपृष्ठ",
  },
  "nav.menu": {
    en: "Menu",
    hi: "मेन्यू",
    mr: "मेनू",
  },
  "nav.reservation": {
    en: "Reservation",
    hi: "आरक्षण",
    mr: "आरक्षण",
  },
  "nav.offers": {
    en: "Offers",
    hi: "ऑफर",
    mr: "ऑफर",
  },
  "nav.about": {
    en: "About",
    hi: "हमारे बारे में",
    mr: "आमच्याबद्दल",
  },
  "nav.gallery": {
    en: "Gallery",
    hi: "गैलरी",
    mr: "गॅलरी",
  },
  "nav.reviews": {
    en: "Reviews",
    hi: "समीक्षाएं",
    mr: "पुनरावलोकने",
  },
  "nav.contact": {
    en: "Contact",
    hi: "संपर्क",
    mr: "संपर्क",
  },
  "nav.login": {
    en: "Login",
    hi: "लॉगिन",
    mr: "लॉगिन",
  },
  "nav.signup": {
    en: "Sign Up",
    hi: "साइन अप",
    mr: "साइन अप",
  },

  // Dashboard
  "dashboard.title": {
    en: "Dashboard",
    hi: "डैशबोर्ड",
    mr: "डॅशबोर्ड",
  },
  "dashboard.orderFood": {
    en: "Order Food",
    hi: "खाना ऑर्डर करें",
    mr: "जेवण ऑर्डर करा",
  },
  "dashboard.myOrders": {
    en: "My Orders",
    hi: "मेरे ऑर्डर",
    mr: "माझे ऑर्डर",
  },
  "dashboard.favorites": {
    en: "Favorites",
    hi: "पसंदीदा",
    mr: "आवडते",
  },
  "dashboard.addresses": {
    en: "Addresses",
    hi: "पते",
    mr: "पत्ते",
  },
  "dashboard.profile": {
    en: "Profile",
    hi: "प्रोफ़ाइल",
    mr: "प्रोफाइल",
  },
  "dashboard.settings": {
    en: "Settings",
    hi: "सेटिंग्स",
    mr: "सेटिंग्ज",
  },
  "dashboard.logout": {
    en: "Logout",
    hi: "लॉगआउट",
    mr: "लॉगआउट",
  },
  "dashboard.partyOrders": {
    en: "Party Orders",
    hi: "पार्टी ऑर्डर",
    mr: "पार्टी ऑर्डर",
  },
  "dashboard.orderTracking": {
    en: "Order Tracking",
    hi: "ऑर्डर ट्रैकिंग",
    mr: "ऑर्डर ट्रॅकिंग",
  },
  "dashboard.wallet": {
    en: "Wallet",
    hi: "वॉलेट",
    mr: "वॉलेट",
  },
  "dashboard.paymentMethods": {
    en: "Payment Methods",
    hi: "भुगतान के तरीके",
    mr: "पेमेंट पद्धती",
  },

  // Common Actions
  "action.submit": {
    en: "Submit",
    hi: "जमा करें",
    mr: "सबमिट करा",
  },
  "action.cancel": {
    en: "Cancel",
    hi: "रद्द करें",
    mr: "रद्द करा",
  },
  "action.save": {
    en: "Save",
    hi: "सहेजें",
    mr: "जतन करा",
  },
  "action.delete": {
    en: "Delete",
    hi: "हटाएं",
    mr: "हटवा",
  },
  "action.edit": {
    en: "Edit",
    hi: "संपादित करें",
    mr: "संपादित करा",
  },
  "action.close": {
    en: "Close",
    hi: "बंद करें",
    mr: "बंद करा",
  },
  "action.addMoney": {
    en: "Add Money",
    hi: "पैसे जोड़ें",
    mr: "पैसे जोडा",
  },
  "action.bookNow": {
    en: "Book Now",
    hi: "अभी बुक करें",
    mr: "आता बुक करा",
  },
  "action.orderNow": {
    en: "Order Now",
    hi: "अभी ऑर्डर करें",
    mr: "आता ऑर्डर करा",
  },
  "action.saving": {
    en: "Saving...",
    hi: "सहेज रहा है...",
    mr: "जतन करत आहे...",
  },
  "action.tryAgain": {
    en: "Try Again",
    hi: "पुनः प्रयास करें",
    mr: "पुन्हा प्रयत्न करा",
  },

  // Order Tracking
  "tracking.activeOrders": {
    en: "Active Orders",
    hi: "सक्रिय ऑर्डर",
    mr: "सक्रिय ऑर्डर",
  },
  "tracking.completedOrders": {
    en: "Completed",
    hi: "पूर्ण",
    mr: "पूर्ण",
  },
  "tracking.orderPlaced": {
    en: "Order Placed",
    hi: "ऑर्डर दिया गया",
    mr: "ऑर्डर दिली",
  },
  "tracking.confirmed": {
    en: "Confirmed",
    hi: "पुष्टि की गई",
    mr: "पुष्टी झाली",
  },
  "tracking.preparing": {
    en: "Preparing",
    hi: "तैयार हो रहा है",
    mr: "तयार होत आहे",
  },
  "tracking.outForDelivery": {
    en: "Out for Delivery",
    hi: "डिलीवरी के लिए रवाना",
    mr: "डिलिव्हरीसाठी निघाली",
  },
  "tracking.delivered": {
    en: "Delivered",
    hi: "डिलीवर किया गया",
    mr: "वितरित",
  },

  // Wallet
  "wallet.balance": {
    en: "Available Balance",
    hi: "उपलब्ध शेष राशि",
    mr: "उपलब्ध शिल्लक",
  },
  "wallet.totalEarned": {
    en: "Total Earned",
    hi: "कुल अर्जित",
    mr: "एकूण कमावले",
  },
  "wallet.totalSpent": {
    en: "Total Spent",
    hi: "कुल खर्च",
    mr: "एकूण खर्च",
  },
  "wallet.rewardPoints": {
    en: "Reward Points",
    hi: "इनाम अंक",
    mr: "रिवॉर्ड पॉइंट",
  },
  "wallet.transactions": {
    en: "Transaction History",
    hi: "लेनदेन इतिहास",
    mr: "व्यवहार इतिहास",
  },

  // Payment Methods
  "payment.card": {
    en: "Card",
    hi: "कार्ड",
    mr: "कार्ड",
  },
  "payment.upi": {
    en: "UPI",
    hi: "यूपीआई",
    mr: "UPI",
  },
  "payment.netBanking": {
    en: "Net Banking",
    hi: "नेट बैंकिंग",
    mr: "नेट बँकिंग",
  },
  "payment.wallet": {
    en: "Wallet",
    hi: "वॉलेट",
    mr: "वॉलेट",
  },
  "payment.addMethod": {
    en: "Add Payment Method",
    hi: "भुगतान विधि जोड़ें",
    mr: "पेमेंट पद्धत जोडा",
  },

  // Restaurant Info
  "restaurant.name": {
    en: "Tarkari",
    hi: "तरकारी",
    mr: "तरकारी",
  },
  "restaurant.tagline": {
    en: "Pure Vegetarian Restaurant",
    hi: "शुद्ध शाकाहारी रेस्तरां",
    mr: "शुद्ध शाकाहारी रेस्टॉरंट",
  },
  "restaurant.location": {
    en: "DombivLi East, Maharashtra",
    hi: "डोंबिवली ईस्ट, महाराष्ट्र",
    mr: "डोंबिवली ईस्ट, महाराष्ट्र",
  },

  // Language Settings
  "language.select": {
    en: "Select Language",
    hi: "भाषा चुनें",
    mr: "भाषा निवडा",
  },
  "language.english": {
    en: "English",
    hi: "अंग्रेज़ी",
    mr: "इंग्रजी",
  },
  "language.hindi": {
    en: "हिन्दी",
    hi: "हिन्दी",
    mr: "हिंदी",
  },
  "language.marathi": {
    en: "मराठी",
    hi: "मराठी",
    mr: "मराठी",
  },

  // Misc
  "misc.welcome": {
    en: "Welcome",
    hi: "स्वागत है",
    mr: "स्वागत आहे",
  },
  "misc.loading": {
    en: "Loading...",
    hi: "लोड हो रहा है...",
    mr: "लोड होत आहे...",
  },
  "misc.noData": {
    en: "No data available",
    hi: "कोई डेटा उपलब्ध नहीं",
    mr: "डेटा उपलब्ध नाही",
  },
  "misc.error": {
    en: "Something went wrong",
    hi: "कुछ गलत हो गया",
    mr: "काहीतरी चूक झाली",
  },
  "misc.success": {
    en: "Success!",
    hi: "सफलता!",
    mr: "यश!",
  },

  // Homepage Hero Section
  "home.badge": {
    en: "🌱 100% Pure Vegetarian • Family Dining",
    hi: "🌱 100% शुद्ध शाकाहारी • पारिवारिक भोजन",
    mr: "🌱 100% शुद्ध शाकाहारी • कौटुंबिक जेवण",
  },
  "home.heroTitle1": {
    en: "Pure Veg",
    hi: "शुद्ध शाकाहारी",
    mr: "शुद्ध शाकाहारी",
  },
  "home.heroTitle2": {
    en: "Family Dining",
    hi: "पारिवारिक भोजन",
    mr: "कौटुंबिक जेवण",
  },
  "home.heroDescription": {
    en: "Experience authentic homestyle vegetarian cuisine in Dombivli East. From traditional North & South Indian to Chinese & snacks - comfort food made with fresh ingredients & love.",
    hi: "डोंबिवली पूर्व में प्रामाणिक घर जैसा शाकाहारी व्यंजन का अनुभव करें। पारंपरिक उत्तर और दक्षिण भारतीय से लेकर चाइनीज़ और स्नैक्स तक - ताज़ी सामग्री और प्यार से बना आरामदायक भोजन।",
    mr: "डोंबिवली पूर्वेत अस्सल घरगुती शाकाहारी पदार्थांचा अनुभव घ्या. पारंपारिक उत्तर व दक्षिण भारतीय ते चायनीज आणि स्नॅक्स - ताज्या साहित्याने व प्रेमाने बनवलेले आरामदायी जेवण.",
  },
  "home.statsDishes": {
    en: "Pure Veg Dishes",
    hi: "शुद्ध शाकाहारी व्यंजन",
    mr: "शुद्ध शाकाहारी पदार्थ",
  },
  "home.statsCuisines": {
    en: "Cuisines",
    hi: "व्यंजन",
    mr: "पाककृती",
  },
  "home.statsFresh": {
    en: "Fresh & Vegetarian",
    hi: "ताज़ा और शाकाहारी",
    mr: "ताजे आणि शाकाहारी",
  },
  "home.exploreMenu": {
    en: "Explore Menu",
    hi: "मेन्यू देखें",
    mr: "मेनू पहा",
  },
  "home.bookTable": {
    en: "Book a Table",
    hi: "टेबल बुक करें",
    mr: "टेबल बुक करा",
  },
  "home.customerRating": {
    en: "Customer Rating",
    hi: "ग्राहक रेटिंग",
    mr: "ग्राहक रेटिंग",
  },
  "home.freshDaily": {
    en: "Fresh Daily",
    hi: "रोज़ ताज़ा",
    mr: "रोज ताजे",
  },
  "home.madeWithLove": {
    en: "Made with love",
    hi: "प्यार से बना",
    mr: "प्रेमाने बनवलेले",
  },
  "home.galleryTitle": {
    en: "Our Delicious Creations",
    hi: "हमारी स्वादिष्ट रचनाएं",
    mr: "आमच्या स्वादिष्ट रचना",
  },
  "home.gallerySubtitle": {
    en: "A visual feast of our most popular dishes",
    hi: "हमारे सबसे लोकप्रिय व्यंजनों की दृश्य दावत",
    mr: "आमच्या सर्वात लोकप्रिय पदार्थांचा दृश्य मेजवानी",
  },
  "home.testimonialsTitle": {
    en: "What Our Guests Say",
    hi: "हमारे मेहमान क्या कहते हैं",
    mr: "आमचे पाहुणे काय म्हणतात",
  },
  "home.tarkariSpecials": {
    en: "Tarkari Specials",
    hi: "तरकारी स्पेशल",
    mr: "तरकारी स्पेशल",
  },

  // Dashboard Stats
  "stats.totalOrders": {
    en: "Total Orders",
    hi: "कुल ऑर्डर",
    mr: "एकूण ऑर्डर",
  },
  "stats.favoriteDishes": {
    en: "Favorite Dishes",
    hi: "पसंदीदा व्यंजन",
    mr: "आवडते पदार्थ",
  },
  "stats.rewardPoints": {
    en: "Reward Points",
    hi: "इनाम अंक",
    mr: "रिवॉर्ड पॉइंट्स",
  },
  "stats.totalSpent": {
    en: "Total Spent",
    hi: "कुल खर्च",
    mr: "एकूण खर्च",
  },

  // Order Status
  "order.delivered": {
    en: "Delivered",
    hi: "डिलीवर हो गया",
    mr: "वितरित",
  },
  "order.inTransit": {
    en: "In Transit",
    hi: "रास्ते में",
    mr: "मार्गात",
  },
  "order.cancelled": {
    en: "Cancelled",
    hi: "रद्द",
    mr: "रद्द",
  },
  "order.processing": {
    en: "Processing",
    hi: "प्रोसेसिंग",
    mr: "प्रक्रियेत",
  },
  "order.reorder": {
    en: "Reorder",
    hi: "फिर से ऑर्डर करें",
    mr: "पुन्हा ऑर्डर करा",
  },
  "order.rateOrder": {
    en: "Rate Order",
    hi: "ऑर्डर रेट करें",
    mr: "ऑर्डर रेट करा",
  },
  "order.trackOrder": {
    en: "Track Order",
    hi: "ऑर्डर ट्रैक करें",
    mr: "ऑर्डर ट्रॅक करा",
  },
  "order.orderAgain": {
    en: "Order Again",
    hi: "फिर से ऑर्डर करें",
    mr: "पुन्हा ऑर्डर करा",
  },
  "order.subtotal": {
    en: "Subtotal",
    hi: "उप-कुल",
    mr: "उप-एकूण",
  },
  "order.deliveryFee": {
    en: "Delivery Fee",
    hi: "डिलीवरी शुल्क",
    mr: "डिलिव्हरी शुल्क",
  },
  "order.total": {
    en: "Total",
    hi: "कुल",
    mr: "एकूण",
  },
  "order.qty": {
    en: "Qty",
    hi: "मात्रा",
    mr: "प्रमाण",
  },
  "order.items": {
    en: "items",
    hi: "आइटम",
    mr: "आयटम",
  },
  "order.item": {
    en: "item",
    hi: "आइटम",
    mr: "आयटम",
  },

  // Cart & Shopping
  "cart.addToCart": {
    en: "Add to Cart",
    hi: "कार्ट में जोड़ें",
    mr: "कार्टमध्ये जोडा",
  },
  "cart.addToFavorites": {
    en: "Add to favorites",
    hi: "पसंदीदा में जोड़ें",
    mr: "आवडत्यांमध्ये जोडा",
  },
  "cart.removeFromFavorites": {
    en: "Remove from favorites",
    hi: "पसंदीदा से हटाएं",
    mr: "आवडत्यांमधून काढा",
  },

  // Dashboard Navigation
  "dashboardNav.backToDashboard": {
    en: "Back to Dashboard",
    hi: "डैशबोर्ड पर वापस",
    mr: "डॅशबोर्डवर परत",
  },
  "dashboardNav.back": {
    en: "Back",
    hi: "वापस",
    mr: "मागे",
  },
  "dashboardNav.homePage": {
    en: "Home Page",
    hi: "होम पेज",
    mr: "मुख्यपृष्ठ",
  },

  // Quick Actions
  "quickActions.title": {
    en: "Quick Actions",
    hi: "त्वरित कार्य",
    mr: "जलद क्रिया",
  },
  "quickActions.recentOrders": {
    en: "Recent Orders",
    hi: "हाल के ऑर्डर",
    mr: "अलीकडील ऑर्डर",
  },
  "quickActions.viewAll": {
    en: "View All",
    hi: "सभी देखें",
    mr: "सर्व पहा",
  },
  "quickActions.topFavorites": {
    en: "Top Favorites",
    hi: "शीर्ष पसंदीदा",
    mr: "आवडते",
  },

  // Gallery
  "gallery.deliciousDish": {
    en: "Delicious Dish",
    hi: "स्वादिष्ट व्यंजन",
    mr: "स्वादिष्ट पदार्थ",
  },

  // Dashboard Welcome
  "dashboard.welcomeBack": {
    en: "Welcome back",
    hi: "वापसी पर स्वागत है",
    mr: "पुन्हा स्वागत",
  },
  "dashboard.rewardPointsMessage": {
    en: "You have {points} reward points. Redeem them on your next order!",
    hi: "आपके पास {points} रिवॉर्ड पॉइंट्स हैं। अपने अगले ऑर्डर पर उन्हें रिडीम करें!",
    mr: "तुमच्याकडे {points} रिवॉर्ड पॉइंट्स आहेत. तुमच्या पुढील ऑर्डरवर ते रिडीम करा!",
  },
  "dashboard.viewRewards": {
    en: "View Rewards",
    hi: "रिवॉर्ड देखें",
    mr: "रिवॉर्ड पहा",
  },
  "dashboard.recentOrders": {
    en: "Recent Orders",
    hi: "हाल के ऑर्डर",
    mr: "अलीकडील ऑर्डर",
  },
  "dashboard.viewAll": {
    en: "View All →",
    hi: "सभी देखें →",
    mr: "सर्व पहा →",
  },
  "dashboard.yourFavorites": {
    en: "Your Favorites",
    hi: "आपके पसंदीदा",
    mr: "तुमचे आवडते",
  },
  "dashboard.manage": {
    en: "Manage →",
    hi: "प्रबंधन करें →",
    mr: "व्यवस्थापन करा →",
  },
  "dashboard.ordered": {
    en: "Ordered",
    hi: "ऑर्डर किया",
    mr: "ऑर्डर केले",
  },
  "dashboard.noRecentOrders": {
    en: "No recent orders found. Start exploring our delicious menu!",
    hi: "कोई हाल का ऑर्डर नहीं मिला। हमारे स्वादिष्ट मेन्यू को देखना शुरू करें!",
    mr: "कोणतेही अलीकडील ऑर्डर आढळले नाहीत. आमच्या चविष्ट मेनूचे अन्वेषण सुरू करा!",
  },
  "dashboard.noFavorites": {
    en: "No favorite dishes yet. Try some dishes and add them to favorites!",
    hi: "अभी तक कोई पसंदीदा पकवान नहीं। कुछ पकवान आज़माएं और उन्हें पसंदीदा में जोड़ें!",
    mr: "अजून कोणतेही आवडते पदार्थ नाहीत. काही पदार्थ चाखून पहा आणि त्यांना आवडत्यांमध्ये जोडा!",
  },
  "dashboard.lastOrdered": {
    en: "Last ordered",
    hi: "अंतिम बार ऑर्डर किया",
    mr: "शेवटचे ऑर्डर केले",
  },

  // Common Labels
  "common.orders": {
    en: "orders",
    hi: "ऑर्डर",
    mr: "ऑर्डर",
  },
  "common.thisMonth": {
    en: "this month",
    hi: "इस महीने",
    mr: "या महिन्यात",
  },
  "common.newFavorites": {
    en: "new favorites",
    hi: "नए पसंदीदा",
    mr: "नवीन आवडते",
  },
  "common.ptsToNextReward": {
    en: "pts to next reward",
    hi: "अगले इनाम के लिए अंक",
    mr: "पुढील बक्षीसासाठी गुण",
  },
  "common.lastMonths": {
    en: "Last 3 months",
    hi: "पिछले 3 महीने",
    mr: "मागील 3 महिने",
  },
  "common.available": {
    en: "available",
    hi: "उपलब्ध",
    mr: "उपलब्ध",
  },
  "common.tryAgain": {
    en: "Try Again",
    hi: "पुनः प्रयास करें",
    mr: "पुन्हा प्रयत्न करा",
  },
  "common.orderNow": {
    en: "Order Now",
    hi: "अभी ऑर्डर करें",
    mr: "आता ऑर्डर करा",
  },
  "common.browseMenu": {
    en: "Browse Menu",
    hi: "मेन्यू देखें",
    mr: "मेनू पहा",
  },

  // Page Titles & Subtitles
  "page.myOrders.title": {
    en: "My Orders",
    hi: "मेरे ऑर्डर",
    mr: "माझे ऑर्डर",
  },
  "page.myOrders.subtitle": {
    en: "Track your order history",
    hi: "अपना ऑर्डर इतिहास देखें",
    mr: "तुमचा ऑर्डर इतिहास पहा",
  },
  "page.favorites.title": {
    en: "My Favorites",
    hi: "मेरे पसंदीदा",
    mr: "माझे आवडते",
  },
  "page.favorites.subtitle": {
    en: "Your saved dishes",
    hi: "आपके सहेजे गए व्यंजन",
    mr: "तुमचे जतन केलेले पदार्थ",
  },
  "page.favorites.noFavorites": {
    en: "No favorites yet!",
    hi: "अभी तक कोई पसंदीदा नहीं!",
    mr: "अद्याप कोणतेही आवडते नाहीत!",
  },
  "page.favorites.addFavorites": {
    en: "Start adding your favorite dishes to see them here.",
    hi: "अपने पसंदीदा व्यंजन यहां देखने के लिए उन्हें जोड़ना शुरू करें।",
    mr: "तुमचे आवडते पदार्थ येथे पाहण्यासाठी ते जोडायला सुरुवात करा.",
  },
  "page.favorites.browseMenu": {
    en: "Browse Menu",
    hi: "मेन्यू देखें",
    mr: "मेनू पहा",
  },
  "page.addresses.title": {
    en: "My Addresses",
    hi: "मेरे पते",
    mr: "माझे पत्ते",
  },
  "page.addresses.subtitle": {
    en: "Manage delivery addresses",
    hi: "डिलीवरी पते प्रबंधित करें",
    mr: "डिलिव्हरी पत्ते व्यवस्थापित करा",
  },
  "page.profile.title": {
    en: "My Profile",
    hi: "मेरी प्रोफ़ाइल",
    mr: "माझी प्रोफाइल",
  },
  "page.profile.subtitle": {
    en: "Manage your account information",
    hi: "अपनी खाता जानकारी प्रबंधित करें",
    mr: "तुमची खाते माहिती व्यवस्थापित करा",
  },
  "page.settings.title": {
    en: "Settings",
    hi: "सेटिंग्स",
    mr: "सेटिंग्ज",
  },
  "page.settings.subtitle": {
    en: "Customize your experience",
    hi: "अपना अनुभव अनुकूलित करें",
    mr: "तुमचा अनुभव सानुकूल करा",
  },
  "page.wallet.title": {
    en: "My Wallet",
    hi: "मेरा वॉलेट",
    mr: "माझे वॉलेट",
  },
  "page.wallet.subtitle": {
    en: "Manage your wallet balance",
    hi: "अपना वॉलेट बैलेंस प्रबंधित करें",
    mr: "तुमची वॉलेट शिल्लक व्यवस्थापित करा",
  },
  "page.paymentMethods.title": {
    en: "Payment Methods",
    hi: "भुगतान के तरीके",
    mr: "पेमेंट पद्धती",
  },
  "page.paymentMethods.subtitle": {
    en: "Manage your saved payment methods",
    hi: "अपने सहेजे गए भुगतान के तरीके प्रबंधित करें",
    mr: "तुमच्या जतन केलेल्या पेमेंट पद्धती व्यवस्थापित करा",
  },
  "page.orderTracking.title": {
    en: "Order Tracking",
    hi: "ऑर्डर ट्रैकिंग",
    mr: "ऑर्डर ट्रॅकिंग",
  },
  "page.orderTracking.subtitle": {
    en: "Track your current order",
    hi: "अपना वर्तमान ऑर्डर ट्रैक करें",
    mr: "तुमचा सध्याचा ऑर्डर ट्रॅक करा",
  },
  "page.partyOrders.title": {
    en: "Party Orders",
    hi: "पार्टी ऑर्डर",
    mr: "पार्टी ऑर्डर",
  },
  "page.partyOrders.subtitle": {
    en: "Order for events and parties",
    hi: "इवेंट और पार्टियों के लिए ऑर्डर करें",
    mr: "इव्हेंट आणि पार्टीसाठी ऑर्डर करा",
  },
  "page.reviews.title": {
    en: "My Reviews",
    hi: "मेरी समीक्षाएं",
    mr: "माझी पुनरावलोकने",
  },
  "page.reviews.subtitle": {
    en: "Your ratings and reviews",
    hi: "आपकी रेटिंग और समीक्षाएं",
    mr: "तुमची रेटिंग आणि पुनरावलोकने",
  },
  "page.reservation.title": {
    en: "Table Reservations",
    hi: "टेबल आरक्षण",
    mr: "टेबल आरक्षण",
  },
  "page.reservation.subtitle": {
    en: "Manage your table bookings",
    hi: "अपनी टेबल बुकिंग प्रबंधित करें",
    mr: "तुमचे टेबल बुकिंग व्यवस्थापित करा",
  },

  // Address related
  "address.home": {
    en: "Home",
    hi: "घर",
    mr: "घर",
  },
  "address.work": {
    en: "Work",
    hi: "कार्यालय",
    mr: "कार्यालय",
  },
  "address.other": {
    en: "Other",
    hi: "अन्य",
    mr: "इतर",
  },
  "address.addNew": {
    en: "Add New Address",
    hi: "नया पता जोड़ें",
    mr: "नवीन पत्ता जोडा",
  },
  "address.default": {
    en: "Default",
    hi: "डिफ़ॉल्ट",
    mr: "डीफॉल्ट",
  },
  "address.setDefault": {
    en: "Set as Default",
    hi: "डिफ़ॉल्ट के रूप में सेट करें",
    mr: "डीफॉल्ट म्हणून सेट करा",
  },
  "address.deliverHere": {
    en: "Deliver Here",
    hi: "यहां डिलीवर करें",
    mr: "येथे डिलिव्हर करा",
  },

  // Form labels
  "form.name": {
    en: "Full Name",
    hi: "पूरा नाम",
    mr: "पूर्ण नाव",
  },
  "form.phone": {
    en: "Phone Number",
    hi: "फ़ोन नंबर",
    mr: "फोन नंबर",
  },
  "form.email": {
    en: "Email Address",
    hi: "ईमेल पता",
    mr: "ईमेल पत्ता",
  },
  "form.address": {
    en: "Address",
    hi: "पता",
    mr: "पत्ता",
  },
  "form.city": {
    en: "City",
    hi: "शहर",
    mr: "शहर",
  },
  "form.state": {
    en: "State",
    hi: "राज्य",
    mr: "राज्य",
  },
  "form.pincode": {
    en: "Pincode",
    hi: "पिनकोड",
    mr: "पिनकोड",
  },
  "form.addressType": {
    en: "Address Type",
    hi: "पता प्रकार",
    mr: "पत्ता प्रकार",
  },
  "form.saveAddress": {
    en: "Save Address",
    hi: "पता सहेजें",
    mr: "पत्ता जतन करा",
  },

  // Settings & Preferences
  "settings.notifications": {
    en: "Notifications",
    hi: "सूचनाएं",
    mr: "सूचना",
  },
  "settings.orderUpdates": {
    en: "Order Updates",
    hi: "ऑर्डर अपडेट",
    mr: "ऑर्डर अपडेट",
  },
  "settings.orderUpdatesDesc": {
    en: "Get notified about your order status",
    hi: "अपने ऑर्डर की स्थिति के बारे में सूचित हों",
    mr: "तुमच्या ऑर्डरच्या स्थितीबद्दल सूचित व्हा",
  },
  "settings.promotions": {
    en: "Promotions & Offers",
    hi: "प्रमोशन और ऑफर",
    mr: "प्रमोशन आणि ऑफर",
  },
  "settings.promotionsDesc": {
    en: "Receive exclusive deals and discounts",
    hi: "विशेष डील और छूट प्राप्त करें",
    mr: "विशेष डील आणि सवलती मिळवा",
  },
  "settings.newsletter": {
    en: "Newsletter",
    hi: "न्यूज़लेटर",
    mr: "न्यूजलेटर",
  },
  "settings.newsletterDesc": {
    en: "Weekly food tips and recipes",
    hi: "साप्ताहिक खाद्य टिप्स और रेसिपी",
    mr: "साप्ताहिक अन्न टिप्स आणि रेसिपी",
  },
  "settings.sms": {
    en: "SMS Notifications",
    hi: "एसएमएस सूचनाएं",
    mr: "SMS सूचना",
  },
  "settings.smsDesc": {
    en: "Receive updates via SMS",
    hi: "एसएमएस के माध्यम से अपडेट प्राप्त करें",
    mr: "SMS द्वारे अपडेट प्राप्त करा",
  },
  "settings.preferences": {
    en: "Preferences",
    hi: "प्राथमिकताएं",
    mr: "प्राधान्ये",
  },
  "settings.darkMode": {
    en: "Dark Mode",
    hi: "डार्क मोड",
    mr: "डार्क मोड",
  },
  "settings.darkModeDesc": {
    en: "Switch to dark theme",
    hi: "डार्क थीम पर स्विच करें",
    mr: "डार्क थीमवर स्विच करा",
  },
  "settings.language": {
    en: "Language",
    hi: "भाषा",
    mr: "भाषा",
  },
  "settings.languageDesc": {
    en: "Select your preferred language",
    hi: "अपनी पसंदीदा भाषा चुनें",
    mr: "तुमची पसंतीची भाषा निवडा",
  },
  "settings.quickLinks": {
    en: "Quick Links",
    hi: "त्वरित लिंक",
    mr: "जलद लिंक्स",
  },
  "settings.helpSupport": {
    en: "Help & Support",
    hi: "मदद और सहायता",
    mr: "मदत आणि समर्थन",
  },
  "settings.privacyPolicy": {
    en: "Privacy Policy",
    hi: "गोपनीयता नीति",
    mr: "गोपनीयता धोरण",
  },
  "settings.termsConditions": {
    en: "Terms & Conditions",
    hi: "नियम और शर्तें",
    mr: "अटी आणि शर्ती",
  },

  // Profile
  "profile.memberSince": {
    en: "Member since",
    hi: "सदस्य तब से",
    mr: "सदस्य कधीपासून",
  },
  "profile.editProfile": {
    en: "Edit Profile",
    hi: "प्रोफ़ाइल संपादित करें",
    mr: "प्रोफाइल संपादित करा",
  },
  "profile.loyaltyPoints": {
    en: "Loyalty Points",
    hi: "लॉयल्टी पॉइंट्स",
    mr: "लॉयल्टी पॉइंट्स",
  },
  "profile.pointsToNextTier": {
    en: "points to next tier",
    hi: "अगले स्तर के लिए अंक",
    mr: "पुढील स्तरासाठी गुण",
  },
  "profile.personalInfo": {
    en: "Personal Information",
    hi: "व्यक्तिगत जानकारी",
    mr: "वैयक्तिक माहिती",
  },
  "profile.firstName": {
    en: "First Name",
    hi: "पहला नाम",
    mr: "पहिले नाव",
  },
  "profile.lastName": {
    en: "Last Name",
    hi: "अंतिम नाम",
    mr: "आडनाव",
  },
  "profile.dateOfBirth": {
    en: "Date of Birth",
    hi: "जन्म तिथि",
    mr: "जन्मतारीख",
  },
  "profile.saveChanges": {
    en: "Save Changes",
    hi: "बदलाव सहेजें",
    mr: "बदल जतन करा",
  },
  "profile.fullName": {
    en: "Full Name",
    hi: "पूरा नाम",
    mr: "पूर्ण नाव",
  },
  "profile.enterName": {
    en: "Enter your name",
    hi: "अपना नाम दर्ज करें",
    mr: "तुमचे नाव टाका",
  },
  "profile.enterPhone": {
    en: "Enter your phone number",
    hi: "अपना फोन नंबर दर्ज करें",
    mr: "तुमचा फोन नंबर टाका",
  },
  "profile.noName": {
    en: "No name set",
    hi: "कोई नाम सेट नहीं",
    mr: "नाव सेट नाही",
  },
  "profile.emailCannotChange": {
    en: "Email address cannot be changed",
    hi: "ईमेल पता बदला नहीं जा सकता",
    mr: "ईमेल पत्ता बदलता येत नाही",
  },
  "profile.walletBalance": {
    en: "Wallet Balance",
    hi: "वॉलेट बैलेंस",
    mr: "वॉलेट शिल्लक",
  },
  "profile.walletDescription": {
    en: "Use for quick payments",
    hi: "त्वरित भुगतान के लिए उपयोग करें",
    mr: "जलद पेमेंटसाठी वापरा",
  },
  "profile.security": {
    en: "Security",
    hi: "सुरक्षा",
    mr: "सुरक्षा",
  },
  "profile.changePassword": {
    en: "Change Password",
    hi: "पासवर्ड बदलें",
    mr: "पासवर्ड बदला",
  },
  "profile.twoFactorAuth": {
    en: "Two-Factor Authentication",
    hi: "दो-कारक प्रमाणीकरण",
    mr: "द्वि-घटक प्रमाणीकरण",
  },
  "profile.deleteAccount": {
    en: "Delete Account",
    hi: "खाता हटाएं",
    mr: "खाते हटवा",
  },
  "profile.accountCreated": {
    en: "Account created",
    hi: "खाता बनाया गया",
    mr: "खाते तयार केले",
  },
  "profile.lastUpdated": {
    en: "Last updated",
    hi: "अंतिम अपडेट",
    mr: "शेवटचे अपडेट",
  },
  "profile.updateSuccess": {
    en: "Profile updated successfully",
    hi: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई",
    mr: "प्रोफाइल यशस्वीरित्या अपडेट झाली",
  },
  "profile.nameRequired": {
    en: "Name is required",
    hi: "नाम आवश्यक है",
    mr: "नाव आवश्यक आहे",
  },
  "profile.featureComingSoon": {
    en: "This feature is coming soon",
    hi: "यह सुविधा जल्द आ रही है",
    mr: "हे वैशिष्ट्य लवकरच येत आहे",
  },
  "profile.deleteAccountWarning": {
    en: "Please contact support to delete your account",
    hi: "अपना खाता हटाने के लिए कृपया सहायता से संपर्क करें",
    mr: "तुमचे खाते हटवण्यासाठी कृपया सपोर्टशी संपर्क साधा",
  },

  // Wallet
  "wallet.availableBalance": {
    en: "Available Balance",
    hi: "उपलब्ध शेष राशि",
    mr: "उपलब्ध शिल्लक",
  },
  "wallet.addMoney": {
    en: "Add Money",
    hi: "पैसे जोड़ें",
    mr: "पैसे जोडा",
  },
  "wallet.enterAmount": {
    en: "Enter amount",
    hi: "राशि दर्ज करें",
    mr: "रक्कम टाका",
  },
  "wallet.quickAmounts": {
    en: "Quick amounts",
    hi: "त्वरित राशि",
    mr: "जलद रक्कम",
  },
  "wallet.proceed": {
    en: "Proceed",
    hi: "आगे बढ़ें",
    mr: "पुढे जा",
  },
  "wallet.transactionHistory": {
    en: "Transaction History",
    hi: "लेनदेन इतिहास",
    mr: "व्यवहार इतिहास",
  },
  "wallet.all": {
    en: "All",
    hi: "सभी",
    mr: "सर्व",
  },
  "wallet.credits": {
    en: "Credits",
    hi: "क्रेडिट",
    mr: "क्रेडिट",
  },
  "wallet.debits": {
    en: "Debits",
    hi: "डेबिट",
    mr: "डेबिट",
  },
  "wallet.rewards": {
    en: "Rewards",
    hi: "रिवॉर्ड",
    mr: "रिवॉर्ड",
  },
  "wallet.refunds": {
    en: "Refunds",
    hi: "रिफंड",
    mr: "रिफंड",
  },

  // About Page
  "about.title": {
    en: "Our Story",
    hi: "हमारी कहानी",
    mr: "आमची कहाणी",
  },
  "about.subtitle": {
    en: "A family's passion for pure vegetarian cuisine",
    hi: "शुद्ध शाकाहारी भोजन के लिए एक परिवार का जुनून",
    mr: "शुद्ध शाकाहारी पाककृतीसाठी कुटुंबाची आवड",
  },
  "about.happyFamilies": {
    en: "Happy Families",
    hi: "खुश परिवार",
    mr: "आनंदी कुटुंबे",
  },
  "about.pureVegetarian": {
    en: "Pure Vegetarian",
    hi: "शुद्ध शाकाहारी",
    mr: "शुद्ध शाकाहारी",
  },
  "about.vegDishes": {
    en: "Veg Dishes",
    hi: "शाकाहारी व्यंजन",
    mr: "शाकाहारी पदार्थ",
  },
  "about.daily": {
    en: "Daily",
    hi: "प्रतिदिन",
    mr: "दररोज",
  },
  "about.ourValues": {
    en: "Our Values",
    hi: "हमारे मूल्य",
    mr: "आमची मूल्ये",
  },
  "about.ourTeam": {
    en: "Meet Our Team",
    hi: "हमारी टीम से मिलें",
    mr: "आमच्या टीमला भेटा",
  },
  "about.journey": {
    en: "Our Journey",
    hi: "हमारी यात्रा",
    mr: "आमचा प्रवास",
  },

  // Contact Page
  "contact.title": {
    en: "Contact Us",
    hi: "संपर्क करें",
    mr: "संपर्क साधा",
  },
  "contact.subtitle": {
    en: "We'd love to hear from you",
    hi: "हम आपसे सुनना पसंद करेंगे",
    mr: "आम्हाला तुमच्याकडून ऐकायला आवडेल",
  },
  "contact.visitUs": {
    en: "Visit Us",
    hi: "हमसे मिलें",
    mr: "आम्हाला भेट द्या",
  },
  "contact.callUs": {
    en: "Call Us",
    hi: "हमें कॉल करें",
    mr: "आम्हाला कॉल करा",
  },
  "contact.emailUs": {
    en: "Email Us",
    hi: "हमें ईमेल करें",
    mr: "आम्हाला ईमेल करा",
  },
  "contact.openingHours": {
    en: "Opening Hours",
    hi: "खुलने का समय",
    mr: "उघडण्याचे तास",
  },
  "contact.sendMessage": {
    en: "Send us a Message",
    hi: "हमें संदेश भेजें",
    mr: "आम्हाला संदेश पाठवा",
  },
  "contact.yourName": {
    en: "Your Name",
    hi: "आपका नाम",
    mr: "तुमचे नाव",
  },
  "contact.yourEmail": {
    en: "Your Email",
    hi: "आपका ईमेल",
    mr: "तुमचा ईमेल",
  },
  "contact.subject": {
    en: "Subject",
    hi: "विषय",
    mr: "विषय",
  },
  "contact.message": {
    en: "Message",
    hi: "संदेश",
    mr: "संदेश",
  },
  "contact.send": {
    en: "Send Message",
    hi: "संदेश भेजें",
    mr: "संदेश पाठवा",
  },

  // Menu Page
  "menu.title": {
    en: "Our Menu",
    hi: "हमारा मेन्यू",
    mr: "आमचा मेनू",
  },
  "menu.subtitle": {
    en: "Explore our delicious vegetarian offerings",
    hi: "हमारे स्वादिष्ट शाकाहारी व्यंजनों का अन्वेषण करें",
    mr: "आमच्या स्वादिष्ट शाकाहारी पदार्थांचा शोध घ्या",
  },
  "menu.northIndian": {
    en: "North Indian",
    hi: "उत्तर भारतीय",
    mr: "उत्तर भारतीय",
  },
  "menu.southIndian": {
    en: "South Indian",
    hi: "दक्षिण भारतीय",
    mr: "दक्षिण भारतीय",
  },
  "menu.chinese": {
    en: "Chinese",
    hi: "चाइनीज़",
    mr: "चायनीज",
  },
  "menu.snacks": {
    en: "Snacks",
    hi: "स्नैक्स",
    mr: "स्नॅक्स",
  },
  "menu.beverages": {
    en: "Beverages",
    hi: "पेय पदार्थ",
    mr: "पेये",
  },
  "menu.thalis": {
    en: "Thalis",
    hi: "थाली",
    mr: "थाळी",
  },
  "menu.orderNow": {
    en: "Order Now",
    hi: "अभी ऑर्डर करें",
    mr: "आता ऑर्डर करा",
  },
};

export const getTranslation = (key: string, lang: Language): string => {
  return translations[key]?.[lang] || translations[key]?.en || key;
};

export const languages = [
  { code: "en" as Language, name: "English", flag: "🇬🇧", nativeName: "English" },
  { code: "hi" as Language, name: "Hindi", flag: "🇮🇳", nativeName: "हिन्दी" },
  { code: "mr" as Language, name: "Marathi", flag: "🇮🇳", nativeName: "मराठी" },
];
