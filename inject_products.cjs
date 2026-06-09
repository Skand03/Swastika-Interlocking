const fs = require('fs');
const content = fs.readFileSync('src/pages/Shuttering.jsx', 'utf8');
const anchor = "const [activeTab, setActiveTab] = useState('rent');";

const productsArr = `

  const products = [
    {
      id: 'steelPlates',
      name: t.steelPlates,
      desc: t.steelPlatesDesc,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjR0IJrqfKjh0hIFmK1vHJcEYPGGcWrpzN7yYdJb5wcwdVeSeTBc-TjFfbdKIuxv9_TY38J3I9wgdbKP6z7qe-m5umrM1JaTMrU4CqKlDg-cCGPbEl9sF93zOj1JPREq_tvL0wmJurvimJwyzv6xJhmerR2Duzhu6-Aau47EQ4R8J3Nk8I-BfgY4oieefib22h08sdsXIibHqonTJH6T8ARTeIc3e9kC_IVVQIyEKahoNpHTS9GUSNFcthNj7oeCP4brBNtIu0m0k",
      icon: null,
      tag: language === "hi" ? "उपलब्ध" : "Available",
      rentPrice: "₹45/day",
      salePrice: "₹2,800"
    },
    {
      id: 'props',
      name: t.props,
      desc: t.propsDesc,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxxgdIGc3Br5Q3qJKN6wmi8rg93PqyJGcg2cAeZWQ6rMpV222ThISgtoXwQzxErLO_Qe2YMCEtcv4Kc2ZniJFc_T6s-Lnfn3Gh08rS7qq89DxMUaUFpuxjptBWrGdi65TUXV1P0qCv7m-HeSgLQtiM7Jspj_jc7KzQeNeotE5-7hh62QZwvT1koKV7sie8g1HIWW6uffy-S590veatRFEdOOLK-j-G8oeCR-pqmvHQIJsbv1cl-ukdRMaRTau8C1HDqvEUuoAaukU",
      icon: null,
      tag: "On Rent",
      rentPrice: "₹15/day",
      salePrice: "₹1,250"
    },
    {
      id: 'scaffolding',
      name: t.scaffolding,
      desc: t.scaffoldingDesc,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHHQCICtCtYPz08e3iutPuKFkZDHSgWT1i3Z51X5l3EClyojM_ezu4jrHreOWeOyEJDJfcbYHGBIFbWkXagPD9lCOhqh1N6yMX7EAUQC3mxMNgZunZ_1ApDrE0z83Dt5yluhQlTT0RAA7eJY7ctaRoiPYAqoH17Zi8yPqewvYQJ3CpPzZgbTVnfxGSTkp6x2WkxyYNV7x25_cQh4MsD7taYP_0SWByx3BpF35rGEVLVLkJ_vfq5xvE24_3qkepHvvktEUjcLFGHM8",
      icon: null,
      tag: language === "hi" ? "उपलब्ध" : "Available",
      rentPrice: "₹120/set",
      salePrice: "₹4,500"
    },
    {
      id: 'clamps',
      name: "Heavy Duty Beam Clamp",
      desc: language === "hi" ? "बीम क्लैंप" : "Heavy Duty Beam Clamp",
      image: null,
      icon: "construction",
      tag: language === "hi" ? "उपलब्ध" : "Available",
      rentPrice: "₹8/day",
      salePrice: "₹450"
    },
    {
      id: 'waller',
      name: "Structural Steel Waller",
      desc: language === "hi" ? "स्टील वालर" : "Structural Steel Waller",
      image: null,
      icon: "grid_view",
      tag: language === "hi" ? "सीमित स्टॉक" : "Limited Stock",
      rentPrice: "₹25/day",
      salePrice: "₹1,850"
    },
    {
      id: 'basePlate',
      name: "Scaffolding Base Plate",
      desc: language === "hi" ? "बेस प्लेट" : "Scaffolding Base Plate",
      image: null,
      icon: "foundation",
      tag: language === "hi" ? "उपलब्ध" : "Available",
      rentPrice: "₹5/day",
      salePrice: "₹320"
    },
    {
      id: 'tieRod',
      name: "Tie Rod with Wing Nut",
      desc: language === "hi" ? "टाई रॉड" : "Tie Rod with Wing Nut",
      image: null,
      icon: "link",
      tag: language === "hi" ? "उपलब्ध" : "Available",
      rentPrice: "₹12/day",
      salePrice: "₹680"
    },
    {
      id: 'plywood',
      name: "Plywood Sheet 18mm",
      desc: language === "hi" ? "प्लाईवुड" : "Plywood Sheet 18mm",
      image: null,
      icon: "layers",
      tag: language === "hi" ? "उपलब्ध" : "Available",
      rentPrice: "₹55/day",
      salePrice: "₹3,400"
    },
    {
      id: 'coupler',
      name: "Forged Swivel Coupler",
      desc: language === "hi" ? "स्विवल कपलर" : "Forged Swivel Coupler",
      image: null,
      icon: "settings_backup_restore",
      tag: language === "hi" ? "उपलब्ध" : "Available",
      rentPrice: "₹4/day",
      salePrice: "₹190"
    }
  ];`;

const finalContent = content.replace(anchor, anchor + productsArr);
fs.writeFileSync('src/pages/Shuttering.jsx', finalContent);
