export const SITE = {
  name: "T&B Global Logística",
  fullName: "T&B Global Logística Internacional",
  whatsapp: "5493518023464",
  whatsappDisplay: "+54 9 351 802-3464",
  whatsapp2: "+56 9 7489 1078",        
  whatsappDisplay2: "+56 9 7489 1078", 
  email: "tbgloballogistica@gmail.com",
  address: "Hilarion Plaza 4157, Cerro de las Rosas, Córdoba Capital (X5009)",
  pricePerKg: 10,
} as const;

export const waLink = (text = "Hola! Quiero cotizar una importación") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const SERVICES = [
  { code: "FCL", title: "Contenedor completo", text: "Para volúmenes grandes. Tu mercadería viaja en un contenedor exclusivo para vos." },
  { code: "LCL", title: "Carga consolidada", text: "Compartís contenedor con otros importadores y pagás solo por los kilos que traés." },
  { code: "COURIER", title: "Envíos aéreos", text: "Para cuando el tiempo importa. Puerta a puerta, con seguimiento de tu envío." },
] as const;

export const ORIGINS = ["China", "Brasil", "India", "EE.UU.", "Europa"] as const;

export const STEPS = [
  { title: "Contanos qué querés importar", text: "Producto, cantidad y datos de tu proveedor." },
  { title: "Recibí tu presupuesto", text: "Calculado según el peso de tu carga. Solo pagás por los kilos que traés." },
  { title: "Coordinamos con tu proveedor", text: "Organizamos la recepción de tu mercadería en China." },
  { title: "Consolidamos y embarcamos", text: "Tu carga comparte contenedor con la de otros comercios y viaja por vía marítima." },
  { title: "Gestionamos la aduana", text: "Nuestro despachante se encarga de los trámites de ingreso al país." },
  { title: "Te la llevamos a tu puerta", text: "Hasta tu comercio o depósito." },
] as const;
