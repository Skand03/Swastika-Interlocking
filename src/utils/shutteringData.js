export const getShutteringProducts = (language) => {
  const isHi = language === "hi";
  
  return [
    {
      id: 'steelPlates',
      name: isHi ? 'शटरिंग प्लेट्स' : 'Shuttering Plates',
      desc: isHi ? 'भारी-शुल्क वाले स्टील और उच्च गुणवत्ता वाली लकड़ी से निर्मित, आवासीय और वाणिज्यिक स्लैब कास्टिंग के लिए आदर्श।' : 'Manufactured from heavy-duty steel and high quality wood, ideal for residential and commercial slab casting.',
      image: '/images/satering-steal-plates.jpg',
      icon: null,
      tag: isHi ? 'उपलब्ध' : 'Available',
      rentPriceRaw: 45,
      salePriceRaw: 2800,
      rentUnit: 'day',
      saleUnit: 'plate'
    },
    {
      id: 'props',
      name: isHi ? 'डोर फ्रेम (Door Frame)' : 'Door Frame',
      desc: isHi ? 'विभिन्न डिजाइनों में उपलब्ध उच्च गुणवत्ता वाले स्टील और लकड़ी के डोर फ्रेम।' : 'High-quality steel and wooden door frames available in various designs.',
      image: '/images/gate-border.jpg',
      icon: null,
      tag: isHi ? 'किराए पर' : 'On Rent',
      rentPriceRaw: 15,
      salePriceRaw: 1250,
      rentUnit: 'day',
      saleUnit: 'frame'
    },
    {
      id: 'scaffolding',
      name: isHi ? 'एच-फ्रेम मचान (Scaffolding)' : 'H-Frame Scaffolding',
      desc: isHi ? 'विभिन्न ऊंचाइयों पर बाहरी और आंतरिक कार्यों के लिए उपयोग में आसान मचान प्रणाली।' : 'Easy-to-assemble scaffolding system for exterior and interior works at varying heights.',
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHHQCICtCtYPz08e3iutPuKFkZDHSgWT1i3Z51X5l3EClyojM_ezu4jrHreOWeOyEJDJfcbYHGBIFbWkXagPD9lCOhqh1N6yMX7EAUQC3mxMNgZunZ_1ApDrE0z83Dt5yluhQlTT0RAA7eJY7ctaRoiPYAqoH17Zi8yPqewvYQJ3CpPzZgbTVnfxGSTkp6x2WkxyYNV7x25_cQh4MsD7taYP_0SWByx3BpF35rGEVLVLkJ_vfq5xvE24_3qkepHvvktEUjcLFGHM8",
      icon: null,
      tag: isHi ? 'उपलब्ध' : 'Available',
      rentPriceRaw: 120,
      salePriceRaw: 4500,
      rentUnit: 'day',
      saleUnit: 'set'
    },
    {
      id: 'mixture',
      name: isHi ? 'मिक्सचर मशीन' : 'Mixture Machine',
      desc: isHi ? 'कंक्रीट मिक्सचर मशीन' : 'Concrete Mixture Machine',
      image: '/images/mixture.jpg',
      icon: null,
      tag: isHi ? 'उपलब्ध' : 'Available',
      rentPriceRaw: 800,
      salePriceRaw: 45000,
      rentUnit: 'day',
      saleUnit: 'machine'
    },
    {
      id: 'generator',
      name: isHi ? 'जेनरेटर' : 'Generator',
      desc: isHi ? 'पोर्टेबल पावर जेनरेटर' : 'Portable Power Generator',
      image: '/images/generator.jpg',
      icon: null,
      tag: isHi ? 'सीमित स्टॉक' : 'Limited Stock',
      rentPriceRaw: 500,
      salePriceRaw: 35000,
      rentUnit: 'day',
      saleUnit: 'machine'
    },
    {
      id: 'pumpPipe',
      name: isHi ? 'ड्रिप वॉटर पंप पाइप' : 'Drip Water Pump Pipe',
      desc: isHi ? 'कृषि और सिंचाई के लिए उच्च गुणवत्ता वाला पाइप' : 'High-quality pipe for agriculture and irrigation',
      image: '/images/Drip-water-pump-pipe.jpg',
      icon: null,
      tag: isHi ? 'उपलब्ध' : 'Available',
      rentPriceRaw: 50,
      salePriceRaw: 3200,
      rentUnit: 'day',
      saleUnit: 'bundle'
    },
    {
      id: 'sprayer',
      name: isHi ? 'स्प्रेयर मशीन' : 'Sprayer Machine',
      desc: isHi ? 'कृषि और बागवानी के लिए उच्च गुणवत्ता वाली स्प्रेयर मशीन' : 'High-quality sprayer machine for agriculture and gardening',
      image: '/images/sprayer-m,machine.jpg',
      icon: null,
      tag: isHi ? 'उपलब्ध' : 'Available',
      rentPriceRaw: 100,
      salePriceRaw: 6800,
      rentUnit: 'day',
      saleUnit: 'machine'
    }
  ];
};
