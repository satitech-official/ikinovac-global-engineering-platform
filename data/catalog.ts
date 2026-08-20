import productImages from "./product-images.json";

export type PriceState = "quote" | "indicative";

export type CatalogCategory = {
  slug: string;
  code: string;
  name: string;
  description: string;
  image: string;
  detailImage: string;
  fallbackImage: string;
  material: string;
  standards: string;
  size: string;
  rating: string;
  connection?: string;
  operation?: string;
  applications: string[];
  variants: {
    sizes: string[];
    materials: string[];
    ratings: string[];
  };
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  code: string;
  brand: string;
  image: string;
  images: string[];
  fallbackImage: string;
  shortDescription: string;
  description: string;
  priceState: PriceState;
  priceLabel: string;
  priceUnit: string;
  availability: string;
  moq: string;
  material: string;
  standards: string;
  size: string;
  rating: string;
  connection?: string;
  operation?: string;
  applications: string[];
  variants: CatalogCategory["variants"];
  technicalDetails: string[];
  featured: boolean;
};

const fallbackImage = "/images/ikinovac-global-supply-cover.png";
type ProductImageRecord = { src: string; source: string; license: string; author: string };
const productImageManifest = productImages as Record<string, ProductImageRecord>;

/**
 * Product visuals are generated locally from this catalogue's own product
 * records. Keeping the URL derivation here means the homepage, category pages,
 * product pages and individual catalogues always address the same asset.
 */
export function getProductImagePath(categorySlug: string, productSlug: string) {
  return productImageManifest[`${categorySlug}/${productSlug}`]?.src ?? `/images/products/${categorySlug}/${productSlug}.svg`;
}

export const catalogCategories: CatalogCategory[] = [
  {
    slug: "valves", code: "VLV", name: "Valves", description: "Industrial flow-control solutions for reliable operation across process, energy and utility applications.",
    image: "https://inoxmen.vn/uploads/2023/11/van-bi-2.png.webp", detailImage: "https://images.pexels.com/photos/5953723/pexels-photo-5953723.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Carbon steel, stainless steel, alloy steel, duplex and special alloys", standards: "API / ASME / ASTM / BS where applicable", size: "1/2 in - 24 in", rating: "Class 150 - 2500 / PN ratings", connection: "Flanged, threaded, socket weld, butt weld", operation: "Manual, pneumatic, electric or hydraulic", applications: ["Oil & Gas", "Petrochemical", "Power", "Water Treatment", "Marine"],
    variants: { sizes: ["1/2 in", "1 in", "2 in", "4 in", "8 in", "12 in+"], materials: ["CS", "SS304", "SS316", "Duplex", "Alloy Steel"], ratings: ["Class 150", "Class 300", "Class 600", "PN16", "PN40"] },
  },
  {
    slug: "pipes-tubes", code: "PIP", name: "Pipes & Tubes", description: "Process piping and tubing for pressure, utility, structural and instrumentation requirements.",
    image: "https://tiimg.tistatic.com/fp/1/002/761/industrial-pipes-117.jpg", detailImage: "https://images.pexels.com/photos/4883682/pexels-photo-4883682.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Carbon steel, stainless steel, alloy steel, duplex, copper", standards: "ASTM / ASME / API / EN where applicable", size: "1/8 in - 48 in", rating: "Schedule / wall-thickness dependent", applications: ["Oil & Gas", "Chemical Processing", "Power", "Water Treatment", "Fabrication"],
    variants: { sizes: ["1/8 in - 1 in", "1 in - 4 in", "4 in - 12 in", "12 in - 24 in", "24 in+"], materials: ["CS", "SS304", "SS316", "Alloy Steel", "Duplex"], ratings: ["SCH 10", "SCH 40", "SCH 80", "SCH 160", "Custom wall"] },
  },
  {
    slug: "pipe-fittings", code: "FIT", name: "Pipe Fittings", description: "Butt-weld, forged and threaded components for engineered piping connections.",
    image: "https://images.pexels.com/photos/5953729/pexels-photo-5953729.jpeg?auto=compress&cs=tinysrgb&w=1200", detailImage: "https://images.pexels.com/photos/4883682/pexels-photo-4883682.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Carbon steel, stainless steel, alloy steel, duplex", standards: "ASME B16.9 / B16.11 / ASTM where applicable", size: "1/8 in - 48 in", rating: "Class / schedule dependent", applications: ["Refining", "Chemical Processing", "Power", "Water", "Fabrication"],
    variants: { sizes: ["1/8 in - 1 in", "1 in - 2 in", "2 in - 6 in", "6 in - 12 in", "12 in+"], materials: ["CS", "SS304", "SS316", "Alloy Steel", "Duplex"], ratings: ["Class 150", "Class 300", "Class 600", "SCH 40", "SCH 80"] },
  },
  {
    slug: "flanges", code: "FLG", name: "Flanges", description: "Engineered flange solutions for process piping, isolation, inspection and maintenance access.",
    image: "https://images.pexels.com/photos/10039994/pexels-photo-10039994.jpeg?auto=compress&cs=tinysrgb&w=1200", detailImage: "https://images.pexels.com/photos/5953723/pexels-photo-5953723.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Carbon steel, stainless steel, alloy steel, duplex", standards: "ASME B16.5 / B16.47 / EN 1092 where applicable", size: "1/2 in - 48 in", rating: "Class 150 - 2500 / PN ratings", applications: ["Oil & Gas", "Petrochemical", "Power", "Marine", "Water Treatment"],
    variants: { sizes: ["1/2 in - 2 in", "2 in - 6 in", "6 in - 12 in", "12 in - 24 in", "24 in+"], materials: ["CS", "SS304", "SS316", "Alloy Steel", "Duplex"], ratings: ["Class 150", "Class 300", "Class 600", "Class 900", "PN16 / PN40"] },
  },
  {
    slug: "fasteners", code: "FST", name: "Fasteners", description: "Industrial fastening systems for piping, structures, mechanical equipment and maintenance work.",
    image: "https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1200", detailImage: "https://images.pexels.com/photos/3862361/pexels-photo-3862361.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Carbon steel, alloy steel, stainless steel, coated grades", standards: "ASTM / ISO / DIN where applicable", size: "M6 - M72 / imperial equivalents", rating: "Grade dependent", applications: ["Plant Maintenance", "Structural Work", "Piping", "Equipment Assembly", "Marine"],
    variants: { sizes: ["M6 - M12", "M16 - M24", "M27 - M36", "M39 - M52", "M56+"], materials: ["CS", "B7", "SS304", "SS316", "High Tensile"], ratings: ["Class 8.8", "Class 10.9", "ASTM A193 B7", "A2-70", "A4-80"] },
  },
  {
    slug: "gaskets-seals", code: "GSK", name: "Gaskets & Seals", description: "Sealing products selected around temperature, pressure, media compatibility and flange configuration.",
    image: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1200", detailImage: "https://images.pexels.com/photos/5953723/pexels-photo-5953723.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Graphite, PTFE, rubber, metal, fibre and elastomer grades", standards: "ASME B16.20 / B16.21 where applicable", size: "DN / NPS and custom dimensions", rating: "Media and flange-rating dependent", applications: ["Process Plants", "Oil & Gas", "Chemical", "Water", "Maintenance"],
    variants: { sizes: ["DN15 - DN50", "DN65 - DN150", "DN200 - DN300", "DN350+", "Custom"], materials: ["Graphite", "PTFE", "NBR", "EPDM", "Metallic"], ratings: ["Class 150", "Class 300", "Class 600", "PN16", "RTJ"] },
  },
  {
    slug: "instrumentation", code: "INS", name: "Instrumentation", description: "Process measurement, indication and control equipment for reliable operating visibility.",
    image: "https://d91ztqmtx7u1k.cloudfront.net/ClientContent/Images/ExtraLarge/2-inch--50-mm-industrial-pres-20241213104926943.jpg", detailImage: "https://tienda.jmh.com.ar/web/image/76193-3012cdf6/iStock-1599098888.jpg", fallbackImage,
    material: "SS316, brass, aluminium, engineered polymers", standards: "IEC / ISO / EN / ASME where applicable", size: "Connection and range dependent", rating: "Range and protection class dependent", applications: ["Oil & Gas", "Power", "Water Treatment", "Pharmaceutical", "Process Industries"],
    variants: { sizes: ["1/4 in connection", "1/2 in connection", "DN15", "DN25", "Custom"], materials: ["SS316", "Brass", "Aluminium", "PP", "PTFE lined"], ratings: ["Low pressure", "0-10 bar", "0-100 bar", "High pressure", "Hazardous area option"] },
  },
  {
    slug: "pumps", code: "PMP", name: "Pumps", description: "Industrial fluid-transfer equipment configured for process media, duty point, material and installation requirements.",
    image: "https://static.tildacdn.com/tild3762-6130-4139-b738-656330613362/GPS.jpg", detailImage: "https://2.wlimg.com/product_images/bc-full/2022/6/10337856/kpd-pump-1655446932_p_6398837_1602293.jpeg", fallbackImage,
    material: "Cast iron, carbon steel, stainless steel, alloy and polymer options", standards: "API / ISO / EN where applicable", size: "Duty and nozzle-size dependent", rating: "Flow, head and material dependent", applications: ["Water Treatment", "Chemical", "Oil & Gas", "Utilities", "Marine"],
    variants: { sizes: ["Compact", "Process duty", "High flow", "High pressure", "Custom duty"], materials: ["Cast Iron", "CS", "SS316", "Alloy", "PP / PVDF"], ratings: ["Low head", "Medium head", "High head", "API process", "ATEX option"] },
  },
  {
    slug: "electrical", code: "ELC", name: "Electrical Products", description: "Industrial electrical distribution, motor-control and connection products for plant and project requirements.",
    image: "https://images.pexels.com/photos/8867434/pexels-photo-8867434.jpeg?auto=compress&cs=tinysrgb&w=1200", detailImage: "https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Copper, aluminium, steel enclosures and engineering polymers", standards: "IEC / IS / UL where applicable", size: "Voltage and enclosure dependent", rating: "Voltage, current and IP rating dependent", applications: ["Manufacturing", "Power", "Water", "Oil & Gas", "Infrastructure"],
    variants: { sizes: ["Compact", "Panel mount", "Floor mount", "Heavy duty", "Project engineered"], materials: ["Copper", "Aluminium", "Mild Steel", "SS316", "Polycarbonate"], ratings: ["230 V", "415 V", "IP54", "IP65", "Hazardous area option"] },
  },
  {
    slug: "automation", code: "AUT", name: "Automation Products", description: "Control and automation components for machine, utility and process-plant applications.",
    image: "https://images.pexels.com/photos/3862361/pexels-photo-3862361.jpeg?auto=compress&cs=tinysrgb&w=1200", detailImage: "https://images.pexels.com/photos/8867434/pexels-photo-8867434.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Industrial electronics, aluminium, steel and engineering polymer housings", standards: "IEC / ISO / CE / UL where applicable", size: "I/O and enclosure dependent", rating: "Signal, supply and protection dependent", applications: ["Process Automation", "Manufacturing", "Water", "Packaging", "Energy"],
    variants: { sizes: ["Compact", "Panel mount", "DIN rail", "Field mount", "System level"], materials: ["ABS", "Aluminium", "Mild Steel", "SS316", "Polycarbonate"], ratings: ["24 VDC", "230 VAC", "IP54", "IP65", "Hazardous area option"] },
  },
  {
    slug: "bearings-power-transmission", code: "BPT", name: "Bearings & Power Transmission", description: "Motion and mechanical-drive components for rotating equipment, conveyors and industrial machinery.",
    image: "https://images.pexels.com/photos/8973132/pexels-photo-8973132.jpeg?auto=compress&cs=tinysrgb&w=1200", detailImage: "https://images.pexels.com/photos/5953729/pexels-photo-5953729.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Bearing steel, stainless steel, cast iron, alloy steel and elastomer elements", standards: "ISO / DIN / manufacturer standard where applicable", size: "Bore, shaft and frame dependent", rating: "Load and speed dependent", applications: ["Manufacturing", "Mining", "Power", "Material Handling", "MRO"],
    variants: { sizes: ["Small bore", "Medium bore", "Large bore", "Heavy duty", "Custom"], materials: ["Bearing Steel", "SS", "Cast Iron", "Alloy Steel", "Elastomer"], ratings: ["Light duty", "Medium duty", "Heavy duty", "High speed", "High temperature"] },
  },
  {
    slug: "hydraulics", code: "HYD", name: "Hydraulic Products", description: "Hydraulic power, motion-control and fluid-connection components for industrial equipment.",
    image: "https://images.pexels.com/photos/5953729/pexels-photo-5953729.jpeg?auto=compress&cs=tinysrgb&w=1200", detailImage: "https://images.pexels.com/photos/4883682/pexels-photo-4883682.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Carbon steel, stainless steel, alloy steel, hose compounds", standards: "ISO / SAE / DIN where applicable", size: "Bore, hose and port dependent", rating: "Pressure and duty dependent", applications: ["Mining", "Marine", "Manufacturing", "Mobile Equipment", "Power"],
    variants: { sizes: ["Compact", "Medium duty", "Heavy duty", "High pressure", "Custom"], materials: ["CS", "SS316", "Alloy Steel", "NBR", "PTFE"], ratings: ["100 bar", "210 bar", "315 bar", "420 bar", "High pressure"] },
  },
  {
    slug: "pneumatics", code: "PNE", name: "Pneumatic Products", description: "Compressed-air preparation, motion and control components for automation and plant services.",
    image: "https://images.pexels.com/photos/5953723/pexels-photo-5953723.jpeg?auto=compress&cs=tinysrgb&w=1200", detailImage: "https://images.pexels.com/photos/5953729/pexels-photo-5953729.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Aluminium, stainless steel, brass and engineered polymers", standards: "ISO / DIN / IEC where applicable", size: "Port, bore and flow dependent", rating: "Supply pressure and duty dependent", applications: ["Automation", "Packaging", "Manufacturing", "Food Processing", "Utilities"],
    variants: { sizes: ["1/8 in", "1/4 in", "3/8 in", "1/2 in", "1 in+"], materials: ["Aluminium", "SS316", "Brass", "NBR", "PU"], ratings: ["6 bar", "8 bar", "10 bar", "16 bar", "Vacuum option"] },
  },
  {
    slug: "industrial-safety", code: "SFT", name: "Industrial Safety", description: "PPE and safety equipment for industrial work environments, maintenance teams and site operations.",
    image: "https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1200", detailImage: "https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Impact-resistant polymers, leather, textile, rubber and specialist fabrics", standards: "EN / IS / ANSI where applicable", size: "Size and protection class dependent", rating: "Application and certification dependent", applications: ["Construction", "Oil & Gas", "Maintenance", "Manufacturing", "Marine"],
    variants: { sizes: ["Small", "Medium", "Large", "XL", "Site pack"], materials: ["Polymer", "Leather", "Nitrile", "Aramid", "Textile"], ratings: ["General industrial", "Chemical resistant", "Electrical safety", "Fall protection", "Fire safety"] },
  },
  {
    slug: "tools-maintenance", code: "TLS", name: "Tools & Maintenance", description: "Industrial hand tools, power tools, measurement devices and workshop equipment for maintenance activity.",
    image: "https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1200", detailImage: "https://images.pexels.com/photos/8973132/pexels-photo-8973132.jpeg?auto=compress&cs=tinysrgb&w=1200", fallbackImage,
    material: "Chrome vanadium steel, HSS, carbide, coated steel and engineering polymers", standards: "DIN / ISO / manufacturer standard where applicable", size: "Tool and drive size dependent", rating: "Duty and accuracy dependent", applications: ["MRO", "Workshop", "Fabrication", "Plant Maintenance", "Construction"],
    variants: { sizes: ["Compact", "Standard", "Heavy duty", "Precision", "Workshop set"], materials: ["Chrome Vanadium", "HSS", "Carbide", "Steel", "Polymer"], ratings: ["Manual", "Electric", "Pneumatic", "Precision", "Heavy duty"] },
  },
];

type ProductSeed = [string, string, string?];

const catalogSeeds: Record<string, ProductSeed[]> = {
  valves: [["Industrial Ball Valve", "Floating / trunnion configurations for isolation and process duty."], ["Gate Valve", "Wedge-gate isolation for pipeline and plant line service."], ["Globe Valve", "Linear-flow control for throttling and shut-off duty."], ["Butterfly Valve", "Compact quarter-turn isolation for utility and process lines."], ["Check Valve", "Non-return protection for pumps and process systems."], ["Control Valve", "Actuated control-valve assemblies for regulated process flow."], ["Needle Valve", "Fine flow adjustment for instrumentation and sample lines."], ["Plug Valve", "Quarter-turn isolation for demanding process media."], ["Diaphragm Valve", "Lined and weir-type isolation for corrosive or hygienic media."], ["Pressure Relief Valve", "Over-pressure protection selected against set-pressure requirements."], ["Safety Valve", "Spring-loaded safety isolation for pressurised equipment."], ["Solenoid Valve", "Electrically operated on/off control for fluid and air circuits."], ["Cryogenic Valve", "Extended-bonnet valve configurations for low-temperature service."], ["Forged Steel Valve", "Compact forged construction for high-pressure process lines."]],
  "pipes-tubes": [["Carbon Steel Seamless Pipe", "Seamless pipe for pressure and process piping systems."], ["Stainless Steel Seamless Pipe", "Corrosion-resistant pipe for process and utility duty."], ["ERW Steel Pipe", "Electric-resistance-welded pipe for structural and utility lines."], ["Welded Stainless Steel Pipe", "Welded pipe solution for corrosion-resistant piping systems."], ["Alloy Steel Pipe", "Alloy pipe options for elevated-temperature and pressure duty."], ["Duplex Stainless Steel Pipe", "Duplex pipe for chloride and corrosive process environments."], ["Super Duplex Pipe", "High-performance duplex material for severe service."], ["Copper Tube", "Copper tubing for HVAC, utilities and process connections."], ["Instrumentation Tube", "Precision tubing for analyser and instrumentation impulse lines."], ["Boiler Tube", "Tube solutions for thermal and steam-system applications."], ["Heat Exchanger Tube", "Tube selected for heat-transfer equipment fabrication."], ["Hydraulic Tube", "Seamless hydraulic tube for fluid-power connections."], ["Structural Steel Tube", "Hollow-section tubes for supports, fabrication and structures."]],
  "pipe-fittings": [["Butt Weld Elbow", "Long and short radius elbow options for welded process lines."], ["Butt Weld Tee", "Equal and reducing tees for pipeline branch connections."], ["Concentric Reducer", "Tapered reducer for aligned-pipe diameter transitions."], ["Eccentric Reducer", "Flat-side reducer for pump suction and horizontal piping."], ["Pipe Coupling", "Threaded and forged couplings for compact line connections."], ["Pipe Union", "Detachable threaded joint for serviceable utility connections."], ["Cross Fitting", "Four-way branch connection for distribution piping."], ["Pipe Cap", "End closure for pressure piping and maintenance points."], ["Stub End", "Lap-joint companion fitting for serviceable flange joints."], ["Pipe Nipple", "Threaded length for valves, instruments and piping assemblies."], ["Forged Socket Weld Fitting", "High-pressure forged fitting for compact welded lines."], ["Threaded Forged Fitting", "Forged threaded fitting for small-bore piping systems."]],
  flanges: [["Weld Neck Flange", "Hubbed flange for high-integrity pipeline and pressure service."], ["Slip On Flange", "Economical flange for general plant piping applications."], ["Blind Flange", "End closure for isolation, inspection and future tie-ins."], ["Socket Weld Flange", "Small-bore flange for high-pressure socket-weld systems."], ["Threaded Flange", "Threaded connection for installations where welding is unsuitable."], ["Lap Joint Flange", "Backing flange for stub-end assemblies and serviceable joints."], ["Orifice Flange", "Meter-run flange assembly for differential-pressure measurement."], ["Spectacle Blind", "Positive isolation device for process-line maintenance."], ["Ring Type Joint Flange", "RTJ flange options for high-pressure, high-temperature duty."], ["Plate Flange", "Fabricated plate flange for utility and structural systems."]],
  fasteners: [["Hex Bolt", "General industrial hex-head bolting for equipment and structures."], ["Hex Nut", "Matched nut grades for bolting and flange assemblies."], ["Flat Washer", "Load-spreading washer for bolted assemblies."], ["Stud Bolt", "Double-ended stud bolts for flange jointing."], ["Anchor Bolt", "Foundation fastening for machinery, structures and skids."], ["U Bolt", "Pipe-support and clamping fastener configurations."], ["Eye Bolt", "Lifting and attachment points selected by duty requirement."], ["Threaded Rod", "Continuous threaded rod for supports and fixings."], ["High Tensile Fastener", "High-strength bolting for critical structural and mechanical duty."], ["Stainless Steel Screw", "Corrosion-resistant screw and fastener selections."]],
  "gaskets-seals": [["Spiral Wound Gasket", "Metal-wound gasket for flanged process piping service."], ["Ring Joint Gasket", "Metal RTJ gasket for high-pressure flange applications."], ["Rubber Sheet Gasket", "Elastomer sheet gasket for water, utility and general service."], ["PTFE Gasket", "Chemically resistant PTFE gasket for compatible media."], ["Graphite Gasket", "High-temperature graphite sealing solution."], ["Metal Jacketed Gasket", "Metal-jacketed sealing for heat exchangers and equipment."], ["Non-Metallic Gasket", "Fibre and composite gasket materials for general sealing."], ["Industrial O-Ring", "Elastomer sealing rings in material and size options."], ["Mechanical Seal", "Rotary-equipment seal selection for pump applications."], ["Industrial Seal Kit", "Application-specific seal and packing kits for maintenance."]],
  instrumentation: [["Pressure Gauge", "Analog pressure indication selected by range and connection."], ["Temperature Gauge", "Bimetal and gas-actuated temperature indication options."], ["Pressure Transmitter", "Electronic pressure measurement for process control loops."], ["Temperature Transmitter", "Temperature input conversion for control and monitoring."], ["Electromagnetic Flow Meter", "Flow measurement for conductive-liquid applications."], ["Ultrasonic Flow Meter", "Non-invasive or inline flow measurement configurations."], ["Level Transmitter", "Continuous level measurement for tanks and process vessels."], ["Level Gauge", "Visual level indication for vessels and storage tanks."], ["Instrumentation Manifold", "Valve-manifold configurations for transmitter isolation."], ["Instrumentation Valve", "Small-bore isolation and bleed valves for impulse lines."], ["Thermowell", "Protective sensor pocket for process-temperature measurement."], ["Industrial Sensor", "Proximity, pressure, temperature and process sensing options."], ["Process Controller", "Panel and field controllers for industrial control applications."]],
  pumps: [["Centrifugal Pump", "End-suction and process centrifugal-pump configurations."], ["Chemical Process Pump", "Material-selected pump solutions for chemical process media."], ["Gear Pump", "Positive-displacement pumping for oils and viscous fluids."], ["Screw Pump", "Low-pulsation pumping for oils and transfer service."], ["Diaphragm Pump", "Air-operated and metering diaphragm pump options."], ["Submersible Pump", "Submersible pumping for drainage, water and sump applications."], ["High Pressure Pump", "High-pressure pumping selected around duty and media."], ["Dosing Pump", "Controlled chemical dosing and metering equipment."], ["Industrial Water Pump", "Utility water-transfer solutions for industrial plants."]],
  electrical: [["Industrial Electric Motor", "IEC motor options selected by power, speed and mounting."], ["Motor Control Centre Panel", "MCC panel assemblies engineered against approved drawings."], ["Variable Frequency Drive Panel", "VFD panel configurations for motor speed control."], ["Variable Frequency Drive", "Electronic speed-control devices for compatible motors."], ["Moulded Case Circuit Breaker", "Protective switching for industrial distribution systems."], ["Industrial Contactor", "Motor and load switching contactors for control panels."], ["Industrial Relay", "Control, monitoring and interface relay configurations."], ["Industrial Switchgear", "Distribution and protection equipment for plant systems."], ["Power Cable", "Industrial cable selections by voltage, conductor and insulation."], ["Cable Gland", "Cable-entry sealing and termination accessories."], ["Junction Box", "Industrial enclosures for cable joints and field connections."], ["Industrial Connector", "Power and control connectors for equipment interconnection."]],
  automation: [["Programmable Logic Controller", "PLC systems selected by I/O count, protocol and application."], ["Human Machine Interface", "Operator HMI panels for machine and process visualisation."], ["Servo Motor", "Precision-motion motors for automation axes."], ["Servo Drive", "Servo-drive control matched to motor and motion duty."], ["Industrial Controller", "Control modules for machine and process applications."], ["Automation Sensor", "Photoelectric, inductive and process sensing options."], ["Remote I/O Module", "Distributed I/O for expandable control architectures."], ["Process Control System", "Integrated process-control hardware for engineered projects."], ["Industrial Ethernet Switch", "Managed and unmanaged networking for automation systems."]],
  "bearings-power-transmission": [["Deep Groove Ball Bearing", "General radial-load bearing for rotating machinery."], ["Spherical Roller Bearing", "Self-aligning bearing for heavy radial and axial loads."], ["Tapered Roller Bearing", "Combined-load bearing for shafts and mechanical drives."], ["Pillow Block Bearing", "Mounted bearing units for conveyors and equipment."], ["Flexible Coupling", "Shaft coupling solutions for aligned rotating equipment."], ["Industrial Gearbox", "Gear reduction solutions for conveyor and process drives."], ["Roller Chain", "Drive and conveyor chain for industrial transmission."], ["Sprocket", "Chain-drive sprockets matched by pitch and hub arrangement."], ["V Belt", "Belt-drive components for motors, fans and pumps."], ["Timing Belt", "Synchronous belt transmission for controlled motion."], ["Industrial Pulley", "Belt-drive pulleys for mechanical power transmission."]],
  hydraulics: [["Hydraulic Pump", "Hydraulic power-generation pumps for fluid-power systems."], ["Hydraulic Directional Valve", "Directional control for hydraulic actuator movement."], ["Hydraulic Pressure Control Valve", "Pressure relief and reducing-valve configurations."], ["Hydraulic Cylinder", "Linear hydraulic actuator designed around stroke and bore."], ["Hydraulic Motor", "Rotary fluid-power motors for industrial equipment."], ["Hydraulic Hose", "Pressure-rated hose assemblies and hose lengths."], ["Hydraulic Fitting", "Adapters and fittings for fluid-power connections."], ["Hydraulic Power Pack", "Integrated hydraulic power units for equipment actuation."], ["Hydraulic Filter", "Return, pressure and suction filtration components."]],
  pneumatics: [["Pneumatic Cylinder", "Linear air-actuator configurations for automation duty."], ["Pneumatic Solenoid Valve", "Electrically piloted control for compressed-air circuits."], ["FRL Unit", "Filter, regulator and lubricator air-preparation assemblies."], ["Industrial Air Filter", "Compressed-air filtration for equipment protection."], ["Air Pressure Regulator", "Pressure-control units for pneumatic circuits."], ["Pneumatic Lubricator", "Mist lubrication for compatible pneumatic equipment."], ["Pneumatic Fitting", "Push-in, threaded and tube connection components."], ["Pneumatic Air Hose", "Air-line hose and tubing for industrial installations."], ["Pneumatic Actuator", "Quarter-turn and linear actuator solutions for valves."]],
  "industrial-safety": [["Industrial Safety Helmet", "Head protection selected by site and certification needs."], ["Industrial Safety Glove", "Hand protection for mechanical, chemical and heat risks."], ["Safety Goggle", "Eye protection for dust, splash and impact risk."], ["Industrial Safety Shoe", "Protective footwear for industrial work areas."], ["Respiratory Protection", "Reusable and disposable respiratory protection options."], ["Face Shield", "Face protection for grinding, splash and general work."], ["Safety Harness", "Fall-protection harnesses and lanyard systems."], ["Fire Extinguisher", "Portable fire-safety equipment by hazard class."], ["Industrial PPE Kit", "Site PPE combinations for workforce issue and replenishment."]],
  "tools-maintenance": [["Industrial Hand Tool Set", "Professional hand-tool combinations for maintenance teams."], ["Industrial Power Tool", "Electric and cordless tools selected by duty and accessory."], ["Cutting Tool", "Cutting, sawing and machining tools for workshop work."], ["Industrial Drill", "Drilling equipment for maintenance and fabrication."], ["Grinding Tool", "Grinding and finishing tools with suitable consumables."], ["Measurement Tool", "Precision measurement tools for inspection and alignment."], ["Workshop Equipment", "Workshop equipment for service, fabrication and maintenance."], ["Maintenance Tool Kit", "Curated maintenance kits for plant and field teams."]],
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function makeProduct(category: CatalogCategory, [name, shortDescription, brand = "Approved manufacturer / project specification" as string], index: number): CatalogProduct {
  const slug = slugify(name);
  const productCode = `IKV-${category.code}-${String(index + 1).padStart(3, "0")}`;
  const image = getProductImagePath(category.slug, slug);
  const fallbackImage = `/images/products/${category.slug}/${slug}.svg`;
  return {
    id: productCode,
    slug,
    name,
    category: category.name,
    categorySlug: category.slug,
    subcategory: name,
    code: productCode,
    brand,
    image,
    images: [image],
    fallbackImage,
    shortDescription,
    description: `${shortDescription} Final selection is made against the application, operating conditions, material compatibility, approved specification and required documentation.`,
    priceState: "quote",
    priceLabel: "Price on Request",
    priceUnit: "Configured item / project quantity",
    availability: "Quote for current lead time",
    moq: "Configuration-dependent; single units may be available",
    material: category.material,
    standards: category.standards,
    size: category.size,
    rating: category.rating,
    connection: category.connection,
    operation: category.operation,
    applications: category.applications,
    variants: category.variants,
    technicalDetails: [
      `Product type: ${name}`,
      `Selection basis: ${shortDescription}`,
      `Material options: ${category.material}`,
      `Standards: ${category.standards}`,
      "Final data sheet and manufacturer confirmation supplied against the RFQ.",
    ],
    featured: index < 1,
  };
}

export const catalogProducts: CatalogProduct[] = catalogCategories.flatMap((category) =>
  (catalogSeeds[category.slug] ?? []).map((seed, index) => makeProduct(category, seed, index)),
);

/** One featured product per catalogue for the homepage discovery experience. */
export const homeCatalogueProducts: CatalogProduct[] = catalogCategories.flatMap((category) => {
  const categoryProducts = catalogProducts.filter((product) => product.categorySlug === category.slug);
  const representative = categoryProducts.find((product) => product.featured) ?? categoryProducts[0];
  return representative ? [representative] : [];
});

export const featuredProducts = catalogProducts.filter((product) => product.featured).slice(0, 8);

export function getCategory(categorySlug: string) {
  return catalogCategories.find((category) => category.slug === categorySlug);
}

export function getProductsForCategory(categorySlug: string) {
  return catalogProducts.filter((product) => product.categorySlug === categorySlug);
}

export function getProduct(categorySlug: string, productSlug: string) {
  return catalogProducts.find((product) => product.categorySlug === categorySlug && product.slug === productSlug);
}

export function getRelatedProducts(product: CatalogProduct) {
  return getProductsForCategory(product.categorySlug).filter((item) => item.id !== product.id).slice(0, 4);
}
