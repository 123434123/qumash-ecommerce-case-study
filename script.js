

(function(){
  "use strict";

  /* ---------------- i18n ---------------- */
  const i18n = {
    en: {
      brand:"QUMASH",
      navShop:"Shop", navAbout:"About",
      heroLine1:"Every piece", heroLine2:"begins as fabric.",
      heroSub:"A small Cairo atelier, cutting considered clothing from honest cloth.",
      heroCta:"View the collection",
      searchPlaceholder:"Search the collection…",
      all:"All", women:"Women", men:"Men", accessories:"Accessories",
      noResults:"Nothing matches that search. Try a different word or clear the filter.",
      sizeLabel:"Sizes",
      modalNote:"Available in our Cairo atelier. Online checkout is on its way.",
      aboutHeading:"Cloth first.",
      aboutBody:"QUMASH began with a single bolt of Egyptian cotton and a question: what happens if you choose the fabric before you draw the shape. Every piece in this collection still starts the same way.",
      footerBlurb:"QUMASH is a small clothing atelier in Cairo, working in silk, wool, cotton and leather.",
      footerShopHeading:"Shop", footerCompanyHeading:"Studio",
      footerLocation:"Zamalek, Cairo",
      footerRights:"All rights reserved.",
      footerHandwoven:"Handled with care in Cairo."
    },
    ar: {
      brand:"قماش",
      navShop:"تسوق", navAbout:"من نحن",
      heroLine1:"كل قطعة", heroLine2:"تبدأ من القماش.",
      heroSub:"أتيليه صغير في القاهرة، يقصّ ملابس مدروسة من نسيج صادق.",
      heroCta:"تصفّح المجموعة",
      searchPlaceholder:"ابحث في المجموعة…",
      all:"الكل", women:"نساء", men:"رجال", accessories:"إكسسوارات",
      noResults:"لا توجد نتائج مطابقة. جرّب كلمة أخرى أو ألغِ الفلتر.",
      sizeLabel:"المقاسات",
      modalNote:"القطعة متوفرة في أتيليه القاهرة. الشراء عبر الموقع قريباً.",
      aboutHeading:"القماش أولاً.",
      aboutBody:"بدأت قماش بلفة واحدة من القطن المصري وسؤال بسيط: ماذا لو اخترنا النسيج قبل أن نرسم الشكل؟ كل قطعة في هذه المجموعة ما زالت تبدأ بالطريقة نفسها.",
      footerBlurb:"قماش أتيليه صغير للملابس في القاهرة، نعمل بالحرير والصوف والقطن والجلد.",
      footerShopHeading:"المتجر", footerCompanyHeading:"الاستوديو",
      footerLocation:"الزمالك، القاهرة",
      footerRights:"جميع الحقوق محفوظة.",
      footerHandwoven:"يُحضَّر بعناية في القاهرة."
    }
  };

  const categoryAccent = { women:"#B99552", men:"#3E5A6B", accessories:"#6C7C5D" };

  /* ---------------- Product data ---------------- */
  const products = [
    { id:1, category:"women", color:"#6E1F2A", price:3200,
      name:{en:"Silk Wrap Dress", ar:"فستان حرير ملفوف"},
      desc:{en:"A fluid wrap silhouette in lustrous silk, finished with a self-tie sash at the waist.",
            ar:"فستان بقصة ملفوفة انسيابية من الحرير اللامع، مزيّن بحزام ذاتي عند الخصر."},
      sizes:["XS","S","M","L","XL"] },
    { id:2, category:"women", color:"#C9A0A6", price:2050,
      name:{en:"Pleated Midi Skirt", ar:"تنورة ميدي مطوية"},
      desc:{en:"Fine knife pleats that move with every step, in a soft dusty-rose crepe.",
            ar:"طيات دقيقة تتحرك مع كل خطوة، مصنوعة من قماش الكريب الوردي الناعم."},
      sizes:["XS","S","M","L"] },
    { id:3, category:"women", color:"#2B2B2E", price:3600,
      name:{en:"Tailored Blazer", ar:"جاكيت رسمي مفصل"},
      desc:{en:"A structured wool blazer with a sharp shoulder line and a single covered button.",
            ar:"جاكيت صوف مفصل بخط كتف واضح وزر واحد مغطى بنفس القماش."},
      sizes:["XS","S","M","L","XL"] },
    { id:4, category:"women", color:"#D8CBB0", price:2600,
      name:{en:"Cashmere Sweater", ar:"سويتر كشمير"},
      desc:{en:"An easy, relaxed knit spun from Mongolian cashmere, in a warm oatmeal tone.",
            ar:"قطعة محبوكة مريحة من كشمير منغولي فاخر، بلون بيج دافئ."},
      sizes:["XS","S","M","L","XL"] },
    { id:5, category:"women", color:"#C7B08A", price:2350,
      name:{en:"Wide-Leg Linen Trousers", ar:"بنطلون كتان واسع"},
      desc:{en:"Breathable linen cut with a high waist and a wide, fluid leg.",
            ar:"بنطلون كتان خفيف بخصر عالٍ وساق واسعة تمنح راحة في الحركة."},
      sizes:["XS","S","M","L"] },
    { id:6, category:"women", color:"#8A6B4C", price:5200,
      name:{en:"Camel Trench Coat", ar:"معطف ترنش بلون الجمل"},
      desc:{en:"A double-breasted trench in brushed camel wool, with a storm flap and belt.",
            ar:"معطف ترنش مزدوج الصدر من صوف مصقول بلون الجمل، مع باتة مطر وحزام."},
      sizes:["S","M","L","XL"] },
    { id:7, category:"women", color:"#0F0F10", price:2950,
      name:{en:"Satin Jumpsuit", ar:"جمبسوت ساتان"},
      desc:{en:"A wide-leg jumpsuit in liquid black satin with a draped cowl neckline.",
            ar:"جمبسوت بساق واسعة من الساتان الأسود اللامع، بياقة مدرّجة انسيابية."},
      sizes:["XS","S","M","L"] },
    { id:8, category:"men", color:"#E7E4DC", price:1450,
      name:{en:"Oxford Cotton Shirt", ar:"قميص أكسفورد قطني"},
      desc:{en:"A classic Oxford weave in brushed cotton, cut for a relaxed, easy fit.",
            ar:"قميص بنسيج أكسفورد الكلاسيكي من القطن الممشط، بقصة مريحة."},
      sizes:["S","M","L","XL","XXL"] },
    { id:9, category:"men", color:"#1F2A3D", price:5400,
      name:{en:"Wool Overcoat", ar:"معطف صوف طويل"},
      desc:{en:"A full-length overcoat in dense navy wool, built for cold Cairo evenings.",
            ar:"معطف طويل من الصوف الكثيف بلون كحلي، مصمم لأمسيات القاهرة الباردة."},
      sizes:["M","L","XL"] },
    { id:10, category:"men", color:"#B7AC93", price:1850,
      name:{en:"Tailored Chinos", ar:"بنطلون تشينو مفصل"},
      desc:{en:"A slim, tapered chino in brushed cotton twill, in warm stone.",
            ar:"بنطلون تشينو ضيق يضيق تدريجياً، من قطن التوين المصقول بلون بيج حجري."},
      sizes:["S","M","L","XL"] },
    { id:11, category:"men", color:"#2F4459", price:2750,
      name:{en:"Denim Jacket", ar:"جاكيت دنيم"},
      desc:{en:"A rigid indigo denim jacket that softens beautifully with wear.",
            ar:"جاكيت دنيم كحلي متين يزداد نعومة مع كل استخدام."},
      sizes:["S","M","L","XL"] },
    { id:12, category:"men", color:"#3B4A3A", price:2100,
      name:{en:"Merino Crewneck", ar:"سويتر ميرينو"},
      desc:{en:"A fine-gauge merino wool crewneck in deep forest green.",
            ar:"سويتر رفيع من صوف الميرينو بلون أخضر غابي داكن."},
      sizes:["S","M","L","XL"] },
    { id:13, category:"accessories", color:"#7A4B2A", price:2600,
      name:{en:"Leather Tote Bag", ar:"شنطة يد جلدية"},
      desc:{en:"A structured tote in full-grain cognac leather, sized for a laptop and books.",
            ar:"شنطة يد بشكل ثابت من الجلد الطبيعي بلون الكونياك، تتسع للابتوب والكتب."},
      sizes:["One size"] },
    { id:14, category:"accessories", color:"#C99A2E", price:950,
      name:{en:"Silk Scarf", ar:"وشاح حرير"},
      desc:{en:"A square silk scarf hand-rolled at the edges, in warm mustard.",
            ar:"وشاح حريري مربع مطرز الحواف يدوياً، بلون خردلي دافئ."},
      sizes:["One size"] },
    { id:15, category:"accessories", color:"#1A1A1A", price:1200,
      name:{en:"Leather Belt", ar:"حزام جلدي"},
      desc:{en:"A slim leather belt with a brushed brass buckle.",
            ar:"حزام جلدي رفيع بإبزيم نحاسي مصقول."},
      sizes:["S/M","L/XL"] },
    { id:16, category:"accessories", color:"#6B4226", price:3400,
      name:{en:"Ankle Boots", ar:"حذاء بوت قصير"},
      desc:{en:"Chestnut leather ankle boots with a stacked block heel.",
            ar:"حذاء بوت جلدي بلون الكستناء بكعب مكدّس مريح."},
      sizes:["37","38","39","40","41"] },
    { id:17, category:"accessories", color:"#33312E", price:750,
      name:{en:"Knit Beanie", ar:"طاقية صوف"},
      desc:{en:"A ribbed wool beanie in charcoal, soft against the skin.",
            ar:"طاقية صوف مضلعة بلون رمادي داكن، ناعمة الملمس."},
      sizes:["One size"] },
    { id:18, category:"accessories", color:"#3E3226", price:1600,
      name:{en:"Aviator Sunglasses", ar:"نظارة شمسية أفياتور"},
      desc:{en:"Aviator-shaped sunglasses in a tortoise acetate frame.",
            ar:"نظارة شمسية بشكل أفياتور، بإطار أسيتات بلون السلحفاة."},
      sizes:["One size"] }
  ];

  /* ---------------- Color helpers ---------------- */
  function shade(hex, percent){
    hex = hex.replace('#','');
    const num = parseInt(hex,16);
    let r=(num>>16), g=(num>>8 & 0xFF), b=(num & 0xFF);
    const adj = v => Math.min(255, Math.max(0, Math.round(v + (percent/100)*255)));
    r=adj(r); g=adj(g); b=adj(b);
    return '#' + ((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1);
  }
  function luminance(hex){
    hex = hex.replace('#','');
    const num = parseInt(hex,16);
    const r=(num>>16)/255, g=(num>>8 & 0xFF)/255, b=(num & 0xFF)/255;
    return 0.2126*r + 0.7152*g + 0.0722*b;
  }
  function swatchBg(hex){
    const light = shade(hex, 16), dark = shade(hex, -14);
    return `repeating-linear-gradient(135deg, rgba(255,255,255,0.09) 0px, rgba(255,255,255,0.09) 1px, transparent 1px, transparent 6px), linear-gradient(155deg, ${light}, ${dark})`;
  }
  function textOn(hex){
    return luminance(hex) > 0.5 ? '#2A241D' : '#EFE9DC';
  }
  const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  function toArabicNumerals(str){ return String(str).replace(/[0-9]/g, d => arabicDigits[d]); }
  function catalogCode(id, lang){
    const padded = String(id).padStart(2,'0');
    return lang==='ar' ? ('رقم ' + toArabicNumerals(padded)) : ('No. ' + padded);
  }
  function formatPrice(n, lang){
    const formatted = n.toLocaleString('en-US');
    return lang==='ar' ? (toArabicNumerals(formatted) + ' ج.م') : ('EGP ' + formatted);
  }
  function countLabel(n, lang){
    if(lang==='ar'){
      if(n===0) return 'لا توجد قطع مطابقة';
      if(n===1) return 'قطعة واحدة';
      if(n===2) return 'قطعتان';
      if(n>=3 && n<=10) return toArabicNumerals(n) + ' قطع';
      return toArabicNumerals(n) + ' قطعة';
    }
    return n===1 ? '1 piece' : (n + ' pieces');
  }

  /* ---------------- State ---------------- */
  const state = { lang:'en', category:'all', search:'' };

  /* ---------------- Render ---------------- */
  function renderFilters(){
    const cats = ['all','women','men','accessories'];
    const el = document.getElementById('filters');
    el.innerHTML = cats.map(c => {
      const active = state.category===c ? ' active' : '';
      return `<button class="filter-btn${active}" data-cat="${c}">${i18n[state.lang][c]}</button>`;
    }).join('');
    el.querySelectorAll('.filter-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        state.category = btn.getAttribute('data-cat');
        renderFilters();
        renderGrid();
      });
    });
  }

  function matchesSearch(p, q){
    if(!q) return true;
    q = q.trim().toLowerCase();
    return p.name.en.toLowerCase().includes(q) || p.name.ar.includes(q) ||
           p.desc.en.toLowerCase().includes(q) || p.desc.ar.includes(q);
  }

  function renderGrid(){
    const lang = state.lang;
    const list = products.filter(p => (state.category==='all' || p.category===state.category) && matchesSearch(p, state.search));
    const grid = document.getElementById('productGrid');
    const noResults = document.getElementById('noResults');
    document.getElementById('resultsCount').textContent = countLabel(list.length, lang);

    if(list.length===0){
      grid.innerHTML = '';
      noResults.hidden = false;
      noResults.textContent = i18n[lang].noResults;
      return;
    }
    noResults.hidden = true;

    grid.innerHTML = list.map(p => `
      <article class="card" data-id="${p.id}">
        <div class="swatch">
          <div class="swatch-inner" style="background-image:${swatchBg(p.color)}">
            <span class="swatch-code" style="color:${textOn(p.color)}">${catalogCode(p.id, lang)}</span>
          </div>
        </div>
        <div class="card-caption">
          <p class="card-category">
            <span class="cat-dot" style="background:${categoryAccent[p.category]}"></span>
            ${i18n[lang][p.category]}
          </p>
          <h3 class="card-name">${p.name[lang]}</h3>
          <p class="card-price">${formatPrice(p.price, lang)}</p>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.card').forEach(card=>{
      card.addEventListener('click', ()=> openModal(Number(card.getAttribute('data-id'))));
    });
  }

  function applyI18n(){
    const lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(i18n[lang][key] !== undefined) el.textContent = i18n[lang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = i18n[lang][key];
    });
    document.documentElement.lang = lang;
    document.documentElement.dir = lang==='ar' ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('lang-ar', lang==='ar');
    document.getElementById('langToggleLabel').textContent = lang==='ar' ? 'EN' : 'ع';
    renderFilters();
    renderGrid();
  }

  /* ---------------- Modal ---------------- */
  function openModal(id){
    const p = products.find(x => x.id===id);
    if(!p) return;
    const lang = state.lang;
    document.getElementById('modalSwatch').style.backgroundImage = swatchBg(p.color);
    document.getElementById('modalCategory').innerHTML =
      `<span class="cat-dot" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${categoryAccent[p.category]}"></span> ${i18n[lang][p.category]}`;
    document.getElementById('modalName').textContent = p.name[lang];
    document.getElementById('modalPrice').textContent = formatPrice(p.price, lang);
    document.getElementById('modalDesc').textContent = p.desc[lang];
    document.getElementById('sizeChips').innerHTML = p.sizes.map(s => `<span class="chip">${s}</span>`).join('');
    document.getElementById('modalNote').textContent = i18n[lang].modalNote;
    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---------------- Wire up ---------------- */
  document.getElementById('langToggle').addEventListener('click', ()=>{
    state.lang = state.lang==='en' ? 'ar' : 'en';
    applyI18n();
  });
  document.getElementById('searchInput').addEventListener('input', (e)=>{
    state.search = e.target.value;
    renderGrid();
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e)=>{
    if(e.target.id === 'modalOverlay') closeModal();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeModal();
  });
  document.querySelectorAll('.footer-cat-link').forEach(a=>{
    a.addEventListener('click', (e)=>{
      state.category = a.getAttribute('data-cat');
      renderFilters();
      renderGrid();
    });
  });

  /* ---------------- Hero + about swatches ---------------- */
  document.getElementById('ms1').style.backgroundImage = swatchBg('#6E1F2A');
  document.getElementById('ms2').style.backgroundImage = swatchBg('#C7B08A');
  document.getElementById('ms3').style.backgroundImage = swatchBg('#3B4A3A');
  document.getElementById('ms4').style.backgroundImage = swatchBg('#1F2A3D');
  document.getElementById('aboutSwatch').style.backgroundImage = swatchBg('#E7E4DC');
  requestAnimationFrame(()=> document.getElementById('heroSwatches').classList.add('in'));

  /* ---------------- Init ---------------- */
  applyI18n();
})();
