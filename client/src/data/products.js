const products = [
{
    id: 1,
    title: "Wooden Body Motorized ICU Five Function Bed",
    category: "ICU Beds",
    price: "₹84,000",
    image: "/src/assets/images/1.png",
    desc: "Wooden body ICU bed with collapsible side railings, wheels, mattress, pillow and IV rod."
  },
  {
    id: 2,
    title: "Motorized ICU Five Function Bed Heavy ABS",
    category: "ICU Beds",
    price: "₹72,000",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=90",
    desc: "Heavy ABS panels, heavy ABS railings, wheels, mattress and IV rod."
  },
  {
    id: 3,
    title: "ICU Five Function Bed Heavy ABS Manual",
    category: "ICU Beds",
    price: "₹41,500",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=90",
    desc: "Five function ICU bed with ABS panel, side railings and mattress."
  },
  {
    id: 4,
    title: "ICU Five Function Bed ABS Panel",
    category: "ICU Beds",
    price: "₹34,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "ABS panel ICU bed with collapsible side railings and wheels."
  },
  {
    id: 5,
    title: "ICU Five Function Bed SS Panel",
    category: "ICU Beds",
    price: "₹33,500",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=90",
    desc: "Stainless steel panel ICU bed with side railings and mattress."
  },
  {
    id: 6,
    title: "ICU Three Function Bed Heavy ABS",
    category: "ICU Beds",
    price: "₹38,500",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=90",
    desc: "Three function ICU bed with heavy ABS panels and side railings."
  },
  {
    id: 7,
    title: "ICU Three Function Bed ABS Panel",
    category: "ICU Beds",
    price: "₹32,500",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Three function ICU bed with ABS panel and collapsible rails."
  },
  {
    id: 8,
    title: "ICU Three Function Bed ABS Variant",
    category: "ICU Beds",
    price: "₹31,500",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=90",
    desc: "Three function ICU bed with wheels, mattress and IV rod."
  },
  {
    id: 9,
    title: "ICU Three Function Bed Heavy ABS Trendelenberg",
    category: "ICU Beds",
    price: "₹33,500",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=90",
    desc: "Trendelenberg and reverse trendelenberg ICU bed."
  },
  {
    id: 10,
    title: "ICU Three Function Bed ABS Trendelenberg",
    category: "ICU Beds",
    price: "₹25,500",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=900&q=90",
    desc: "Three function ICU bed with ABS panel and side rails."
  },
  {
    id: 11,
    title: "ICU Three Function Bed SS Panel Trendelenberg",
    category: "ICU Beds",
    price: "₹24,500",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=90",
    desc: "SS panel ICU bed with trendelenberg functions."
  },
  {
    id: 12,
    title: "ICU Two Function Bed SS Panels",
    category: "ICU Beds",
    price: "₹22,500",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=90",
    desc: "Two function ICU bed with SS panels and drop-down railings."
  },
  {
    id: 13,
    title: "Fowler Two Function Bed ABS Rails",
    category: "Fowler Beds",
    price: "₹27,500",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Fowler bed with ABS side railings and wheels."
  },
  {
    id: 14,
    title: "Fowler Two Function Bed Collapsible Rails",
    category: "Fowler Beds",
    price: "₹20,500",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&q=90",
    desc: "Two function Fowler bed with collapsible rails."
  },
  {
    id: 15,
    title: "Fowler Two Function Bed No Wheels",
    category: "Fowler Beds",
    price: "₹17,500",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=900&q=90",
    desc: "Fowler bed with mattress and IV rod."
  },
  {
    id: 16,
    title: "Fowler Two Function Bed ABS Basic",
    category: "Fowler Beds",
    price: "₹15,500",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Basic Fowler bed with kneerest and backrest."
  },
  {
    id: 17,
    title: "Fowler Two Function Bed ABS Wheels",
    category: "Fowler Beds",
    price: "₹19,500",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "ABS panel Fowler bed with wheels."
  },
  {
    id: 18,
    title: "Fowler Two Function Bed SS Panel",
    category: "Fowler Beds",
    price: "₹16,500",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "SS panel Fowler bed with side railings."
  },
  {
    id: 19,
    title: "Fowler Two Function Bed SS Basic",
    category: "Fowler Beds",
    price: "₹14,500",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Basic SS panel Fowler bed."
  },
  {
    id: 20,
    title: "Semi Fowler Single Function Bed Wheels",
    category: "Semi Fowler Beds",
    price: "₹18,500",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=900&q=90",
    desc: "Semi Fowler bed with backrest and wheels."
  },
  {
    id: 21,
    title: "Semi Fowler Single Function Bed No Wheels",
    category: "Semi Fowler Beds",
    price: "₹16,000",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=900&q=90",
    desc: "Semi Fowler bed with backrest, mattress and IV rod."
  },
  {
    id: 22,
    title: "Semi Fowler Single Function Bed ABS Basic",
    category: "Semi Fowler Beds",
    price: "₹13,800",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=900&q=90",
    desc: "ABS panel semi Fowler bed with backrest only."
  },
  {
    id: 23,
    title: "Semi Fowler Single Function Bed SS Wheels",
    category: "Semi Fowler Beds",
    price: "₹17,500",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=900&q=90",
    desc: "SS panel semi Fowler bed with wheels."
  },
  {
    id: 24,
    title: "Semi Fowler Single Function Bed SS Rails",
    category: "Semi Fowler Beds",
    price: "₹15,000",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=900&q=90",
    desc: "SS panel semi Fowler bed with collapsible railings."
  },
  {
    id: 25,
    title: "Semi Fowler Single Function Bed SS Basic",
    category: "Semi Fowler Beds",
    price: "₹12,800",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=900&q=90",
    desc: "Economy semi Fowler bed with mattress and pillow."
  },
  {
    id: 26,
    title: "Plain Bed Simple",
    category: "Beds",
    price: "₹9,500",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=90",
    desc: "Plain hospital bed with mattress, pillow and IV fixing."
  },
  {
    id: 27,
    title: "Pediatric Plain Bed",
    category: "Beds",
    price: "₹9,800",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=90",
    desc: "Pediatric plain bed with side railings and mattress."
  },
  {
    id: 28,
    title: "Reclining Attendant Bed Wheels",
    category: "Attendant Beds",
    price: "₹14,500",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Attendant bed with mattress, wheels and chair position."
  },
  {
    id: 29,
    title: "Wooden Deluxe Attendant Bed",
    category: "Attendant Beds",
    price: "₹13,500",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Wooden attendant bed with mattress and storage."
  },
  {
    id: 30,
    title: "Attendant Bed With Storage",
    category: "Attendant Beds",
    price: "₹14,500",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Attendant bed with mattress and storage provision."
  },
  {
    id: 31,
    title: "Attendant Bed With Two Lockers",
    category: "Attendant Beds",
    price: "₹13,000",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Attendant bed with mattress and attached dual lockers."
  },
  {
    id: 32,
    title: "Attendant Bed Dual Locker Basic",
    category: "Attendant Beds",
    price: "₹12,000",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Compact attendant bed with two lockers."
  },
  {
    id: 33,
    title: "Attendant Bed Basic",
    category: "Attendant Beds",
    price: "₹7,000",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Basic attendant bed with mattress."
  },
  {
    id: 34,
    title: "Corporate Deluxe Locker With Book Shelf",
    category: "Lockers",
    price: "₹6,400",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&q=90",
    desc: "Corporate locker with book shelf and SS top."
  },
  {
    id: 35,
    title: "Corporate Deluxe Locker SS Top",
    category: "Lockers",
    price: "₹5,800",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&q=90",
    desc: "Corporate locker with 304 grade stainless top."
  },
  {
    id: 36,
    title: "Bed Side Locker Deluxe",
    category: "Lockers",
    price: "₹5,000",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&q=90",
    desc: "Deluxe bedside locker with SS top."
  },
  {
    id: 37,
    title: "Bed Side Locker Standard",
    category: "Lockers",
    price: "₹3,800",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&q=90",
    desc: "Standard bedside locker with stainless top."
  },
  {
    id: 38,
    title: "Bed Side Stand Full SS",
    category: "Stands",
    price: "₹6,200",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Full stainless bedside stand."
  },
  {
    id: 39,
    title: "Bed Side Stand Powder Coated",
    category: "Stands",
    price: "₹2,800",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Powder coated bedside stand."
  },
  {
    id: 40,
    title: "3 Function Electric Ultrasound Examination Table",
    category: "Examination Tables",
    price: "₹62,000",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Electric height adjustable ultrasound and examination table."
  },
  {
    id: 41,
    title: "Gynic 3 Function Electric Examination Table",
    category: "Examination Tables",
    price: "₹62,000",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Gynecology electric examination table."
  },
  {
    id: 42,
    title: "Two Function Hydraulic Examination Table",
    category: "Examination Tables",
    price: "₹33,500",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Hydraulic ultrasound scanning and examination table."
  },
  {
    id: 43,
    title: "Gynic Hydraulic Examination Table",
    category: "Examination Tables",
    price: "₹33,500",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Hydraulic gynecology examination table."
  },
  {
    id: 44,
    title: "Deluxe Examination Couch Gas Spring",
    category: "Examination Tables",
    price: "₹21,500",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Deluxe couch with gas spring backrest."
  },
  {
    id: 45,
    title: "Deluxe Examination Couch",
    category: "Examination Tables",
    price: "₹20,500",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Deluxe examination couch with mattress and foot step."
  },
  {
    id: 46,
    title: "Gynic Examination Couch",
    category: "Examination Tables",
    price: "₹21,500",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Gynecology couch with trolley and foot step."
  },
  {
    id: 47,
    title: "Simple Examination Couch",
    category: "Examination Tables",
    price: "₹11,500",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Simple examination couch with mattress."
  },
  {
    id: 48,
    title: "Gynic Simple Examination Table",
    category: "Examination Tables",
    price: "₹9,500",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Basic gynecology examination table."
  },
  {
    id: 49,
    title: "Simple Examination Table Backrest",
    category: "Examination Tables",
    price: "₹8,500",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Simple table with backrest, mattress and foot step."
  },
  {
    id: 50,
    title: "Simple Examination Table Basic",
    category: "Examination Tables",
    price: "₹8,000",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90",
    desc: "Basic examination table with mattress."
  },
  {
    id: 51,
    title: "Emergency Recovery Trolley ABS Rails",
    category: "Trolleys",
    price: "₹38,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "Hydraulic emergency recovery trolley with ABS side railings."
  },
  {
    id: 52,
    title: "Emergency Recovery Trolley Hydraulic",
    category: "Trolleys",
    price: "₹34,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "Hydraulic patient recovery trolley with mattress."
  },
  {
    id: 53,
    title: "Stretcher Trolley Full SS Folding",
    category: "Trolleys",
    price: "₹17,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "304 grade stainless stretcher trolley with folding rails."
  },
  {
    id: 54,
    title: "Stretcher Trolley Full SS Oxygen Provision",
    category: "Trolleys",
    price: "₹17,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "SS stretcher trolley with oxygen cylinder provision."
  },
  {
    id: 55,
    title: "Stretcher Trolley Full SS Basic",
    category: "Trolleys",
    price: "₹14,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "Basic stainless stretcher trolley with wheels."
  },
  {
    id: 56,
    title: "OT Deluxe SS Crash Cart",
    category: "Crash Carts",
    price: "₹38,500",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=90",
    desc: "Premium OT crash cart with bins and containers."
  },
  {
    id: 57,
    title: "ICU Deluxe MS Cart SS Top",
    category: "Crash Carts",
    price: "₹29,500",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=90",
    desc: "ICU cart with 304 grade SS top and storage bins."
  },
  {
    id: 58,
    title: "Crash Cart Full SS Single Row",
    category: "Crash Carts",
    price: "₹19,500",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=90",
    desc: "Single row stainless crash cart with containers."
  },
  {
    id: 59,
    title: "Monitor Trolley Full SS",
    category: "Trolleys",
    price: "₹28,500",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Monitor trolley with sockets and cable system."
  },
  {
    id: 60,
    title: "Monitor Trolley Powder Coated",
    category: "Trolleys",
    price: "₹19,500",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Powder coated monitor trolley with electric sockets."
  },
  {
    id: 61,
    title: "Three Shelf Instrument Trolley",
    category: "Instrument Trolleys",
    price: "₹17,500",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=90",
    desc: "Three shelf stainless instrument trolley."
  },
  {
    id: 62,
    title: "Instrument Trolley 48 Inch",
    category: "Instrument Trolleys",
    price: "₹15,500",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=90",
    desc: "Large 48 inch stainless instrument trolley."
  },
  {
    id: 63,
    title: "Instrument Trolley 40 Inch",
    category: "Instrument Trolleys",
    price: "₹13,500",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=90",
    desc: "Medium size instrument trolley."
  },
  {
    id: 64,
    title: "Instrument Trolley 28 Inch",
    category: "Instrument Trolleys",
    price: "₹11,500",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=90",
    desc: "Compact stainless instrument trolley."
  },
  {
    id: 65,
    title: "L Shape Instrument Trolley",
    category: "Instrument Trolleys",
    price: "₹12,500",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=90",
    desc: "L-shaped trolley for operation rooms."
  },
  {
    id: 66,
    title: "Dressing Trolley SS",
    category: "Trolleys",
    price: "₹12,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "Stainless dressing trolley with wheels."
  },
  {
    id: 67,
    title: "Mayo Trolley Double Bar",
    category: "Trolleys",
    price: "₹9,000",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=90",
    desc: "Adjustable mayo trolley double bar."
  },
  {
    id: 68,
    title: "Mayo Trolley Single Bar",
    category: "Trolleys",
    price: "₹8,000",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=90",
    desc: "Single bar mayo trolley with tray."
  },
  {
    id: 69,
    title: "ECG Trolley Full SS",
    category: "Trolleys",
    price: "₹8,500",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Stainless ECG trolley with wheels."
  },
  {
    id: 70,
    title: "ECG Trolley Powder Coated",
    category: "Trolleys",
    price: "₹5,800",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Powder coated ECG trolley."
  },
  {
    id: 71,
    title: "OT Drug Trolley Full SS",
    category: "Trolleys",
    price: "₹30,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "OT drug trolley with drawers and wheels."
  },
  {
    id: 72,
    title: "Autoclave Storage Trolley",
    category: "Trolleys",
    price: "₹28,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "Storage trolley for autoclave use."
  },
  {
    id: 73,
    title: "Sensor Scrub Station",
    category: "Scrub Stations",
    price: "₹15,500",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=900&q=90",
    desc: "Sensor operated scrub sink station."
  },
  {
    id: 74,
    title: "Foot Operated Scrub Station",
    category: "Scrub Stations",
    price: "₹10,500",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=900&q=90",
    desc: "Foot operated OT scrub station."
  },
  {
    id: 75,
    title: "Wall Mounted Scrub Station",
    category: "Scrub Stations",
    price: "₹6,000",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=900&q=90",
    desc: "Wall mounted scrub sink."
  },
  {
    id: 76,
    title: "OT Shoes Stand Full SS",
    category: "Stands",
    price: "₹12,500",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "SS OT shoes stand."
  },
  {
    id: 77,
    title: "OT Shoes Stand Powder Coated",
    category: "Stands",
    price: "₹9,500",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Powder coated OT shoes stand."
  },
  {
    id: 78,
    title: "Electric Labor Table Telescopic",
    category: "Labor Tables",
    price: "₹78,000",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=90",
    desc: "Electric telescopic labor table."
  },
  {
    id: 79,
    title: "Hydraulic Labor Table Telescopic",
    category: "Labor Tables",
    price: "₹62,000",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=90",
    desc: "Hydraulic labor table with adjustable height."
  },
  {
    id: 80,
    title: "Labor Table Full SS",
    category: "Labor Tables",
    price: "₹43,500",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=90",
    desc: "Full stainless steel labor table."
  },
  {
    id: 81,
    title: "Simple Labor Table",
    category: "Labor Tables",
    price: "₹29,500",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=90",
    desc: "Simple labor table with accessories."
  },
  {
    id: 82,
    title: "Baby Resuscitation Trolley",
    category: "Baby Care",
    price: "₹11,500",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=90",
    desc: "Baby resuscitation trolley with imported wheels."
  },
  {
    id: 83,
    title: "Baby Cradle With Mattress",
    category: "Baby Care",
    price: "₹5,400",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&q=90",
    desc: "Baby cradle with mattress."
  },
  {
    id: 84,
    title: "Over Food Trolley Gas Spring",
    category: "Trolleys",
    price: "₹7,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "Overbed food trolley gas spring adjustable."
  },
  {
    id: 85,
    title: "Over Food Trolley Knob Adjustment",
    category: "Trolleys",
    price: "₹4,800",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "Knob adjustable overbed food trolley."
  },
  {
    id: 86,
    title: "Revolving Stool SS Wheels Cushion",
    category: "Stools",
    price: "₹3,600",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "SS revolving stool with wheels and cushion."
  },
  {
    id: 87,
    title: "Revolving Stool SS Wheels",
    category: "Stools",
    price: "₹3,200",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "SS revolving stool with wheels."
  },
  {
    id: 88,
    title: "Revolving Stool SS Base",
    category: "Stools",
    price: "₹2,600",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "SS base revolving stool."
  },
  {
    id: 89,
    title: "Revolving Stool Powder Coated Wheels Cushion",
    category: "Stools",
    price: "₹2,600",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Powder coated revolving stool with cushion."
  },
  {
    id: 90,
    title: "Revolving Stool Powder Coated Wheels",
    category: "Stools",
    price: "₹2,000",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Powder coated revolving stool."
  },
  {
    id: 91,
    title: "Revolving Stool Powder Coated Base",
    category: "Stools",
    price: "₹1,600",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Basic revolving stool."
  },
  {
    id: 92,
    title: "Multipurpose Stool Full SS",
    category: "Stools",
    price: "₹2,500",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Full stainless multipurpose stool."
  },
  {
    id: 93,
    title: "Multipurpose Stool Powder Coated",
    category: "Stools",
    price: "₹1,300",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=90",
    desc: "Powder coated multipurpose stool."
  },
  {
    id: 94,
    title: "IV Stand Full SS Wheels",
    category: "IV Stands",
    price: "₹2,400",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Full SS IV stand with wheels."
  },
  {
    id: 95,
    title: "IV Stand Full SS",
    category: "IV Stands",
    price: "₹2,100",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Stainless steel IV stand."
  },
  {
    id: 96,
    title: "IV Stand Powder Coated Wheels",
    category: "IV Stands",
    price: "₹1,700",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Powder coated IV stand with wheels."
  },
  {
    id: 97,
    title: "IV Stand MS Powder Coated",
    category: "IV Stands",
    price: "₹1,300",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "MS powder coated IV stand."
  },
  {
    id: 98,
    title: "Foot Step Double Full SS",
    category: "Foot Steps",
    price: "₹2,400",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&q=90",
    desc: "Double foot step stainless steel."
  },
  {
    id: 99,
    title: "Foot Step Single Full SS",
    category: "Foot Steps",
    price: "₹1,800",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&q=90",
    desc: "Single stainless steel foot step."
  },
  {
    id: 100,
    title: "Foot Step Double Powder Coated",
    category: "Foot Steps",
    price: "₹1,600",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&q=90",
    desc: "Double powder coated foot step."
  },
  {
    id: 101,
    title: "Foot Step Single Powder Coated",
    category: "Foot Steps",
    price: "₹1,000",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&q=90",
    desc: "Single powder coated foot step."
  },
  {
    id: 102,
    title: "Two Tier Bowl Stand SS",
    category: "Stands",
    price: "₹3,000",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=90",
    desc: "Two tier stainless steel bowl stand."
  },
  {
    id: 103,
    title: "Bed Side Screen Full SS",
    category: "Screens",
    price: "₹11,500",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=90",
    desc: "Full stainless bedside privacy screen with cloth."
  },
  {
    id: 104,
    title: "Bed Side Screen Standard",
    category: "Screens",
    price: "₹4,800",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=90",
    desc: "Standard bedside privacy screen."
  },
  {
    id: 105,
    title: "C Type Jumbo Oxygen Cylinder Trolley",
    category: "Oxygen Trolleys",
    price: "₹4,800",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "Jumbo oxygen cylinder trolley with wheels."
  },
  {
    id: 106,
    title: "B Type Oxygen Cylinder Trolley",
    category: "Oxygen Trolleys",
    price: "₹3,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "B type oxygen cylinder trolley."
  },
  {
    id: 107,
    title: "A Type Oxygen Cylinder Trolley",
    category: "Oxygen Trolleys",
    price: "₹2,800",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "A type oxygen cylinder trolley."
  },
  {
    id: 108,
    title: "Bio Waste Management Trolley Full SS",
    category: "Waste Management",
    price: "₹14,500",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90",
    desc: "Full stainless bio waste management trolley."
  }

]

export default products;