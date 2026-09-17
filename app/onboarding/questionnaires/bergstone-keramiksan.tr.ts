import type { QuestionnaireTranslation } from "../types";

/** Turkish text for the Bergstone Keramiksan questionnaire. Option lists follow the German order. */
export const bergstoneKeramiksanTr: QuestionnaireTranslation = {
  title: "Bergstone Keramiksan – İçerik & Web Sitesi Soru Formu",
  intro: {
    headline: "İçerik & Web Sitesi Soru Formu",
    body: [
      "Bergstone Keramiksan için içerik üretim paketimizde sizi daha iyi tanıyıp size özel içerikler üretebilmek için bu sorulara cevap vermenizi rica ediyoruz. Bu sorular bize hem web sitesi aşamasında hem de içerik fikirleri üretirken yardımcı olacak.",
    ],
    duration: "Tahmini süre: 7–10 dakika",
  },
  contact: {
    title: "Formu kim dolduruyor?",
    help: "Sorularımız olduğunda doğrudan doğru kişiye ulaşabilmemiz için.",
    fields: {
      name: "Adınız Soyadınız",
      role: "Şirketteki pozisyonunuz",
      email: "E-posta",
      phone: "Telefon",
    },
  },
  sections: {
    social: { title: "Sosyal Medya & İçerik" },
    website: {
      title: "Yeni Web Sitesi",
      intro: {
        title: "Web Sitesi Yenileme",
        body: [
          "Bergstone Keramiksan'ın web sitesini tamamen yeniden tasarlayacağız.",
          "Yeni web sitesi yalnızca kataloglarınızı göstermekle kalmayacak; ziyaretçilerin farklı fayansları, koleksiyonları, ebatları, modelleri ve teknik bilgileri keşfedip ardından talep gönderebileceği düzenli bir ürün kataloğu olarak kurulacak.",
          "Fiyatlar web sitesinde herkese açık olarak gösterilmeyecek.",
        ],
      },
    },
  },
  questions: {
    q1: {
      group: "Müşterileriniz",
      label: "Bergstone Keramiksan için en önemli müşteri grupları hangileri?",
      help: "Lütfen önceliğe göre sıralayın: 1 = en yüksek öncelik.",
      options: [
        "Fayans ustaları",
        "İnşaat firmaları / Zanaatkârlar",
        "Mutfak stüdyoları / Mutfak satıcıları",
        "Mimarlar / İç mimarlar / Proje geliştiriciler",
        "Bireysel müşteriler / Son kullanıcılar",
      ],
    },
    q2: {
      label: "Sizi farklı kılan ne? Müşteriler neden başka fayans satıcıları yerine sizi tercih ediyor – ya da neden tercih etmeli?",
      help: "Müşterilerinizin kendi söylediği şekilde de yazabilirsiniz.",
      placeholder: "örn. „Büyük ebatlı fayansları sizde hemen stoktan alabiliyorum.“",
    },
    q3: {
      label: "Yeni müşteriler size genellikle nasıl ulaşıyor?",
      options: [
        "Doğrudan showroom'a geliyorlar",
        "WhatsApp üzerinden yazıyorlar",
        "Bizi arıyorlar",
        "Instagram / sosyal medya üzerinden yazıyorlar",
        "E-posta veya web sitesi üzerinden talep gönderiyorlar",
        "Tavsiye / kulaktan kulağa",
        "Diğer",
      ],
      followUps: {
        purchase_process_description: {
          label: "İlk talepten satın almaya kadar olan tipik süreci kısaca anlatın.",
          help: "Bireysel ve kurumsal müşterilerde süreç farklıysa, lütfen ikisini de anlatın.",
          placeholder: "örn. Fayans ustaları WhatsApp'tan yazıyor, sonra depoya gelip doğrudan sipariş veriyor …",
        },
      },
    },
    q4: {
      label: "Müşterilerinizin size nasıl ulaşmasını istiyorsunuz?",
      options: [
        "Showroom'a gelmeleri",
        "Bizi aramaları",
        "WhatsApp'tan yazmaları",
        "Instagram / sosyal medyadan yazmaları",
        "Web sitemizdeki formu doldurmaları",
        "E-posta göndermeleri",
        "Diğer",
      ],
    },
    q5: {
      label: "Müşterileriniz fayans satın almadan önce en sık hangi soruları soruyor?",
      help: "Örneğin metrekare fiyatı, stok durumu, uygun ebat, banyoya uygunluk, teslimat, döşeme vb.",
    },
    q6: {
      label: "Kurumsal müşterilerinizden – örneğin fayans ustaları, inşaat firmaları veya mutfak stüdyolarından – en sık hangi sorunları duyuyorsunuz?",
      help: "Ne kadar somut olursa o kadar iyi – Reels'lerimiz tam da bu durumlardan doğuyor.",
      placeholder: "örn. „120'lik plakaları asansörsüz 4. kata çıkaramıyoruz.“",
    },
    q7: {
      group: "Ürünleriniz",
      label: "Önümüzdeki 1–3 ayda özellikle hangi ürünleri veya koleksiyonları satmak istiyorsunuz – ve onları özel kılan ne?",
      help: "Ürün adları, ebatlar, renkler, kampanyalar veya linklerle – ve bu ürünleri öne çıkaran özelliklerle, örn. ağırlık, format veya stoktan temin.",
      placeholder: "örn. Pamesa mermer görünümlü 60x120, hemen stoktan …",
    },
    q8: {
      group: "Satış & Teslimat",
      label: "Şu anda hangi ülkelere fayans teslimatı yapıyorsunuz?",
      options: ["Almanya", "Avusturya", "Hollanda", "Belçika", "İsviçre", "Diğer"],
    },
    q9: {
      label:
        "Bölgeniz dışındaki, özellikle Avusturya ve Hollanda'daki müşteriler için sipariş ve teslimat süreci nasıl işliyor?",
      options: [
        "Müşteri doğrudan bizden sipariş veriyor, teslimatı biz organize ediyoruz",
        "Müşteri bizden sipariş veriyor, nakliyeyi kendisi organize ediyor",
        "Teslimat bir nakliye firması / lojistik ortağı üzerinden yapılıyor",
        "Süreç sipariş miktarına ve teslimat yerine göre değişiyor",
        "Diğer",
      ],
      followUps: {
        delivery_conditions: {
          label:
            "Avusturya, Hollanda veya diğer ülkelere teslimatı tanıtırken dikkate almamız gereken minimum sipariş miktarları, teslimat ücretleri, belirli teslimat süreleri veya başka önemli koşullar var mı?",
        },
      },
    },
    q10: {
      group: "İçerik tarzı",
      label: "Esprili, trendlere dayalı ve biraz daha sıra dışı videolara ne kadar açıksınız?",
      help: "Buna örneğin güncel sosyal medya trendleri, çalışan skeçleri, bilerek sıkılmış tepkiler, „Patronum beni bu videoyu çekmeye zorluyor“ konseptleri veya çalışanlar arasındaki esprili etkileşimler dahil olabilir.",
      anchors: {
        1: "İçerikler yalnızca ciddi ve profesyonel olmalı",
        3: "Profesyonel ve eğlenceli içeriklerin dengeli bir karışımı",
        5: "Espriye, trendlere, çalışan skeçlerine ve sıra dışı konseptlere çok açığız",
      },
    },
    q11: {
      label: "Reels'lerimizde düzenli olarak kimler kamera karşısına geçebilir?",
      options: [
        "Genel müdür / İşletme sahibi",
        "Satış ekibi",
        "Showroom çalışanları",
        "Depo / Lojistik çalışanları",
        "Birden fazla çalışan birlikte",
        "Prensip olarak tüm çalışanlar yer alabilir",
        "Diğer",
      ],
    },
    q12: {
      label: "Sosyal medya içerikleri için hangi dilleri kullanmalıyız?",
      options: ["Almanca", "Türkçe", "İngilizce"],
      followUps: {
        social_primary_language: {
          label: "Birden fazla dil kullanılacaksa: Sosyal medya hesabının ana dili hangisi olmalı?",
          options: ["Almanca", "Türkçe", "İngilizce"],
        },
      },
    },
    q13: {
      label: "İçeriklerde kesinlikle kaçınmamız gereken ya da daha sık görmek istediğiniz bir şey var mı?",
    },
    q14: {
      group: "Ürün kataloğu",
      label: "Şu anda hangi markaları / üreticileri satıyorsunuz ve yeni web sitesinde hangilerini sergilemek istersiniz?",
      help: "Lütfen şu anda önemli olan tüm markaları veya üreticileri listeleyin. Bazı markaların diğerlerinden daha fazla öne çıkarılmasını istiyorsanız bunu da belirtebilirsiniz.",
    },
    q15: {
      group: "Diller",
      label: "Yeni web sitesi hangi dillerde olmalı?",
      options: ["Almanca", "Türkçe", "İngilizce"],
      followUps: {
        website_default_language: {
          label: "Web sitesinin ana dili / varsayılan dili hangisi olmalı?",
          options: ["Almanca", "Türkçe", "İngilizce"],
        },
      },
    },
  },
  final: {
    title: "Kataloglar & Web Sitesi Materyalleri",
    body: [
      "Yeni web sitesi için size ayrıca bir Google Drive klasörü sağlayacağız.",
      "Lütfen yeni web sitesinde kullanılacak tüm güncel katalogları bu klasöre yükleyin.",
      "Lütfen mümkünse eski katalogları veya artık satmadığınız ürünlere ait katalogları yüklemeyin.",
      "Katalogları ve ürünleri doğru şekilde eşleştirebilmemiz için dosyaları mümkünse marka / üreticiye göre düzenleyin veya adlandırın.",
    ],
    listTitle: "Bu klasöre ayrıca mevcut materyallerinizi de yükleyebilirsiniz, örneğin:",
    list: [
      "Ürün fotoğrafları",
      "Showroom fotoğrafları",
      "Depo fotoğrafları",
      "Ekip fotoğrafları",
      "Proje / referans fotoğrafları",
      "Logolar ve marka materyalleri",
    ],
    note: "Mevcut bilgilerimize göre Bergstone Keramiksan artık kapı satmıyor. Bu nedenle kapılar ve kapı katalogları yeni web sitesine aktarılmayacak.",
    submitLabel: "Formu gönder",
  },
  success: {
    title: "Teşekkürler!",
    body: [
      "Bilgileriniz başarıyla iletildi.",
      "Ekibimiz yanıtlarınızı şimdi değerlendirecek ve hem içerik planlamasında hem de yeni web sitenizin yapısında dikkate alacak.",
      "Kataloglarınız ve web sitesi materyallerinizle ilgili bilgileri Google Drive klasörümüz üzerinden ayrıca alacaksınız.",
    ],
  },
};
