import React from 'react';
import { useNavigate } from 'react-router-dom';

const TRANSLATIONS = {
  hi: {
    title: 'हमारे कंक्रीट उत्पाद',
    desc: 'आधुनिक बुनियादी ढांचे में स्थायित्व, संरचनात्मक अखंडता और सौंदर्य उत्कृष्टता के लिए इंजीनियर प्रीमियम ग्रेड सामग्री।',
    priceRange: 'मूल्य सीमा',
    getQuote: 'कोट प्राप्त करें',
    products: [
      {
        id: 'pavers',
        name: 'इंटरलॉकिंग पेवर ब्लॉक',
        desc: 'ड्राइववे, रास्ते और औद्योगिक यार्ड के लिए उपयुक्त भारी-शुल्क ब्लॉक। कई आकृतियों और फ़िनिश में उपलब्ध।',
        price: '₹45 - ₹85 / वर्ग फीट',
        tag: 'भारी शुल्क',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_r0tVzGRxseITNhneHbS3ml8RuEMQZQhrhMPOcJIF72KqtLLOKTawO4FCWdUw8FtWplooYYdJqLNR4y5qhFOBNP_uG2UV6sTfjIBuWC3H-vx2fTz-ED5ouceEsqNZRRmmkKRDm0P42SMH011vvqF8JhM1pyaopiw53Gc7zsgNIccBlR5hjoJzh72YIgUULCXrFcauphb_2Pj0FMt7hjnOupYNjbZO2TNlQ6ayNZYX-gnE2bfTLApicNYb-Q_fe8btULFRY1X8R_s',
        value: 'Paver Blocks'
      },
      {
        id: 'cement',
        name: 'सीमेंट',
        desc: 'आपकी सभी निर्माण आवश्यकताओं के लिए अग्रणी ब्रांडों से उच्च-शक्ति ओपीसी और पीपीसी सीमेंट।',
        price: '₹380 - ₹450 / बैग',
        tag: 'ग्रेड 53',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1NdfUo36JbsjX8WYjyS83HrIj5Rdt8B63m5I6IAWVstWPoQ6aqWI1lqm33K_xuCnh0pRRXvQkjHdfySH21-H8fBmH-uLGoYFxAg6EmnuTfXcaia4WJ07CsMMCUXnt6zhMvfQsDPALqX9aSjSykI_yuNiwUHdD_CjtMFtmfnTwAetU5R3JDbIo7oIjRCEp9TQiZhO-XFzBwClmyPdL0xVwruxxmkuvDQh3bDb-6Dan9S1hhN-Tx57qJM7Ugh8mUr1MwIdEalIzBDk',
        value: 'Cement'
      },
      {
        id: 'sand',
        name: 'नदी की रेत (Plaster Sand)',
        desc: 'प्लास्टर और कंक्रीट मिक्स के लिए उपयुक्त मिट्टी-मुक्त तीन बार धुली हुई नदी की रेत।',
        price: '₹2,800 - ₹3,500 / ट्रक',
        tag: 'महीन ग्रेड',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9XPYx4p3gzv22LMLuMhFnnhfNd4Cc4XUofIO0AAE8hsrAnq696T2oWA3gs_tGwLd_bMV4JBaJ0NOfUk8P6C8UQA_UsmTn_3KLgLCZnK5-6OQM_9vj_x4gwZ4102Em-xnpmjDYT2fLqk3ojc60uA1zIrqpyrwPeinWl4EtK_oPouf_xGksSz-w7t2LPPPHr9KldU2sDq0Vx7tsilFb0TIQnKjKfFkIhErKn2ajq74LDcjKB6C4mlLOffZhc2ga6t0zhI9WC_QJZDo',
        value: 'River Sand'
      },
      {
        id: 'stone',
        name: 'कुचला हुआ पत्थर (Aggregate)',
        desc: '10mm, 20mm और 40mm आकार में उपलब्ध। कंक्रीट कास्टिंग और सड़क आधार के लिए आदर्श।',
        price: '₹1,200 - ₹1,800 / टन',
        tag: 'विभिन्न आकार',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlbzBJd1UrQMI90ko3bY7cuYaOkouCccAG1191YYy5zVVJ2DrtYeN_IARsSF1wsj1uLW3d0iksHsg16-zHoVgv6KZoYgEU2kxfGWMfBrctv7GZaL1gy27yjE7zfHkmZNsj4zrP-6yIWavvVN9VPTEeXGqdnTk_vwqDFGliQZJMM_QkyBUDgtnol-o-JGJdH0Wr-vSxgzlxEmn3bi36cQ8M7NWNC3v6rI3YCi1eI9kX1Lu5zGmDVJTu6BxjFyCgURoA9QoKJT938fA',
        value: 'Crushed Stone'
      },
      {
        id: 'pipes',
        name: 'निकासी पाइप (Hume Pipes)',
        desc: 'कुशल जल प्रबंधन और सीवेज प्रणालियों के लिए उच्च घनत्व वाले कंक्रीट पाइप।',
        price: '₹450 - ₹2,500 / नग',
        tag: 'मानक आकार',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8EusR5ZJpd4ljNb8hpiwkXCYm4voe6K-INy8cT132egITMBjWpGR5XPbldF1HHtF4Vexc-89DUVI7kZRZ_WK93p_LWJNDZEfIhNUpmosyA7XNty6B2mcwasSvhEgmXFSYNrYLyfTxHKywZmJWD4-pepi9xAV75sCPAl8UrXBvmEpV7BQJzuZj3NJZFC2UGJgULGrbhdDHuJpzIS5bSEHLMQH_2WaFv_R7plX26JI471jnrMbKbWRlFLAMRA-N9iUQF-PY6eOita8',
        value: 'Drainage Pipes'
      },
      {
        id: 'blocks',
        name: 'खोखले ब्लॉक (Concrete Blocks)',
        desc: 'दीवार निर्माण और बाड़ लगाने के लिए लागत प्रभावी और थर्मल कुशल इमारत ब्लॉक।',
        price: '₹35 - ₹55 / नग',
        tag: 'हल्का वजन',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBFjaVpcyRiDUEoER6UF5k6ZWGM_H_s3t0c6fBdr4As3bWZ4Y50IcZKLZSaO9TqgOO2xf9xS21QNXds9q78TW49KEFhBrqt7zaL4sNZ_FnIPuojEZ4zKHYkfT066Jxd9shz7nM1ve8wJsDWeEu_tbaogYNNRE6ptK7cYq0PUtyYZfsqpX5SyG2Z5UbYU2-Kewv34wW5XfWvWd9tRmFV7FmN86hntq-JXaOjfMyrcpLbbAwoO7VhhHFR5DTiBG3RSVMnUBV_6sQKIY',
        value: 'Hollow Blocks'
      }
    ]
  },
  en: {
    title: 'Our Construction Products',
    desc: 'Premium grade materials engineered for durability, structural integrity, and aesthetic excellence in modern infrastructure.',
    priceRange: 'Price Range',
    getQuote: 'Get Quote',
    products: [
      {
        id: 'pavers',
        name: 'Interlocking Paver Blocks',
        desc: 'Heavy-duty blocks suitable for driveways, pathways, and industrial yards. Available in multiple shapes and finishes.',
        price: '₹45 - ₹85 / sq.ft',
        tag: 'Heavy Duty',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_r0tVzGRxseITNhneHbS3ml8RuEMQZQhrhMPOcJIF72KqtLLOKTawO4FCWdUw8FtWplooYYdJqLNR4y5qhFOBNP_uG2UV6sTfjIBuWC3H-vx2fTz-ED5ouceEsqNZRRmmkKRDm0P42SMH011vvqF8JhM1pyaopiw53Gc7zsgNIccBlR5hjoJzh72YIgUULCXrFcauphb_2Pj0FMt7hjnOupYNjbZO2TNlQ6ayNZYX-gnE2bfTLApicNYb-Q_fe8btULFRY1X8R_s',
        value: 'Paver Blocks'
      },
      {
        id: 'cement',
        name: 'Cement',
        desc: 'High-strength OPC and PPC cement from leading brands for all your construction requirements.',
        price: '₹380 - ₹450 / bag',
        tag: 'Grade 53',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1NdfUo36JbsjX8WYjyS83HrIj5Rdt8B63m5I6IAWVstWPoQ6aqWI1lqm33K_xuCnh0pRRXvQkjHdfySH21-H8fBmH-uLGoYFxAg6EmnuTfXcaia4WJ07CsMMCUXnt6zhMvfQsDPALqX9aSjSykI_yuNiwUHdD_CjtMFtmfnTwAetU5R3JDbIo7oIjRCEp9TQiZhO-XFzBwClmyPdL0xVwruxxmkuvDQh3bDb-6Dan9S1hhN-Tx57qJM7Ugh8mUr1MwIdEalIzBDk',
        value: 'Cement'
      },
      {
        id: 'sand',
        name: 'River Sand (Plaster Sand)',
        desc: 'Triple-washed, silt-free river sand perfect for plastering and concrete mixtures.',
        price: '₹2,800 - ₹3,500 / truck',
        tag: 'Fine Grade',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9XPYx4p3gzv22LMLuMhFnnhfNd4Cc4XUofIO0AAE8hsrAnq696T2oWA3gs_tGwLd_bMV4JBaJ0NOfUk8P6C8UQA_UsmTn_3KLgLCZnK5-6OQM_9vj_x4gwZ4102Em-xnpmjDYT2fLqk3ojc60uA1zIrqpyrwPeinWl4EtK_oPouf_xGksSz-w7t2LPPPHr9KldU2sDq0Vx7tsilFb0TIQnKjKfFkIhErKn2ajq74LDcjKB6C4mlLOffZhc2ga6t0zhI9WC_QJZDo',
        value: 'River Sand'
      },
      {
        id: 'stone',
        name: 'Crushed Stone (Aggregate)',
        desc: 'Available in 10mm, 20mm, and 40mm sizes. Ideal for concrete casting and road base.',
        price: '₹1,200 - ₹1,800 / ton',
        tag: 'Multiple Sizes',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlbzBJd1UrQMI90ko3bY7cuYaOkouCccAG1191YYy5zVVJ2DrtYeN_IARsSF1wsj1uLW3d0iksHsg16-zHoVgv6KZoYgEU2kxfGWMfBrctv7GZaL1gy27yjE7zfHkmZNsj4zrP-6yIWavvVN9VPTEeXGqdnTk_vwqDFGliQZJMM_QkyBUDgtnol-o-JGJdH0Wr-vSxgzlxEmn3bi36cQ8M7NWNC3v6rI3YCi1eI9kX1Lu5zGmDVJTu6BxjFyCgURoA9QoKJT938fA',
        value: 'Crushed Stone'
      },
      {
        id: 'pipes',
        name: 'Drainage Pipes (Hume Pipes)',
        desc: 'High-density concrete pipes for efficient water management and sewage systems.',
        price: '₹450 - ₹2,500 / unit',
        tag: 'Standard Sized',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8EusR5ZJpd4ljNb8hpiwkXCYm4voe6K-INy8cT132egITMBjWpGR5XPbldF1HHtF4Vexc-89DUVI7kZRZ_WK93p_LWJNDZEfIhNUpmosyA7XNty6B2mcwasSvhEgmXFSYNrYLyfTxHKywZmJWD4-pepi9xAV75sCPAl8UrXBvmEpV7BQJzuZj3NJZFC2UGJgULGrbhdDHuJpzIS5bSEHLMQH_2WaFv_R7plX26JI471jnrMbKbWRlFLAMRA-N9iUQF-PY6eOita8',
        value: 'Drainage Pipes'
      },
      {
        id: 'blocks',
        name: 'Hollow Blocks (Concrete Blocks)',
        desc: 'Cost-effective and thermal efficient building blocks for wall construction and fencing.',
        price: '₹35 - ₹55 / unit',
        tag: 'Lightweight',
        tagColor: 'bg-primary/10 text-primary',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBFjaVpcyRiDUEoER6UF5k6ZWGM_H_s3t0c6fBdr4As3bWZ4Y50IcZKLZSaO9TqgOO2xf9xS21QNXds9q78TW49KEFhBrqt7zaL4sNZ_FnIPuojEZ4zKHYkfT066Jxd9shz7nM1ve8wJsDWeEu_tbaogYNNRE6ptK7cYq0PUtyYZfsqpX5SyG2Z5UbYU2-Kewv34wW5XfWvWd9tRmFV7FmN86hntq-JXaOjfMyrcpLbbAwoO7VhhHFR5DTiBG3RSVMnUBV_6sQKIY',
        value: 'Hollow Blocks'
      }
    ]
  }
};

export default function Products({ language }) {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const handleBookNow = (productName) => {
    navigate('/order', { state: { selectedProduct: productName } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div class="py-24 bg-surface min-h-screen">
      {/* Header */}
      <header class="max-w-container-max mx-auto px-gutter mb-16 text-center select-none">
        <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">
          {t.title}
        </h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          {t.desc}
        </p>
      </header>

      {/* Product Grid */}
      <section class="max-w-container-max mx-auto px-gutter">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {t.products.map(product => (
            <div key={product.id} class="bg-surface-container-low rounded-lg overflow-hidden flex flex-col shadow-sm border border-surface-variant/30 transition-all duration-300 hover:shadow-md group">
              <div class="aspect-[4/3] overflow-hidden select-none">
                <img 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={product.name} 
                  src={product.image} 
                />
              </div>
              <div class="p-card-padding flex flex-col flex-grow">
                <div class="flex items-center gap-2 mb-2 select-none">
                  <span class={`${product.tagColor} px-3 py-1 rounded-full text-xs font-bold`}>
                    {product.tag}
                  </span>
                </div>
                <h3 class="font-headline-md text-headline-md text-on-surface mb-2 font-semibold">
                  {product.name}
                </h3>
                <p class="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
                  {product.desc}
                </p>
                <div class="flex items-end justify-between mt-auto">
                  <div class="select-none">
                    <p class="text-on-surface-variant text-xs uppercase tracking-wider">{t.priceRange}</p>
                    <p class="text-primary font-bold text-lg">{product.price}</p>
                  </div>
                  <button 
                    onClick={() => handleBookNow(product.value)}
                    class="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-primary-container transition-colors cursor-pointer active:scale-95 text-sm"
                  >
                    {t.getQuote}
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
