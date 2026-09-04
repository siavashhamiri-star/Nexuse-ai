import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";
import {
  Building2,
  Train,
  Plane,
  Waves,
  Sun,
  Moon,
  Sparkles,
  Compass,
  Eye,
  Info,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Trees,
  Zap,
  Cloud,
  Droplets,
  Layers,
  Sliders,
  Camera,
  Globe,
  Radio,
  Share2,
  RefreshCw,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const persianGulfCityImg = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80";

interface PersianGulfCity3DTabProps {
  appLanguage: string;
  speakHomePersonaText?: (txt: string) => void;
}

interface Hotspot {
  id: string;
  nameFa: string;
  nameEn: string;
  category: "tower" | "farm" | "monorail" | "taxi" | "underwater" | "beach" | "sky";
  position: THREE.Vector3;
  descriptionFa: string;
  descriptionEn: string;
  specs: { label: string; val: string }[];
}

export const PersianGulfCity3DTab: React.FC<PersianGulfCity3DTabProps> = ({
  appLanguage,
  speakHomePersonaText
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Controls & States
  const [cameraMode, setCameraMode] = useState<"orbit" | "tour" | "monorail" | "taxi" | "underwater" | "skyfarm">("orbit");
  const [timeOfDay, setTimeOfDay] = useState<"golden" | "night" | "noon">("golden");
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [flyingTaxisCount, setFlyingTaxisCount] = useState<number>(12);
  const [monorailSpeed, setMonorailSpeed] = useState<number>(1.2);
  const [waterTurbulence, setWaterTurbulence] = useState<number>(0.8);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [soundscapeActive, setSoundscapeActive] = useState<boolean>(false);
  const [activeViewTab, setActiveViewTab] = useState<"3d" | "render">("3d");

  // Audio Synth Ref for futuristic ambiance
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);

  // Hotspots definitions
  const hotspots: Hotspot[] = [
    {
      id: "sky-towers",
      nameFa: "برج‌های معرفت و انرژی مانا",
      nameEn: "Mana Energy & Wisdom Eco-Towers",
      category: "tower",
      position: new THREE.Vector3(0, 35, 0),
      descriptionFa: "آسمان‌خراش‌های چندمنظوره زیست‌محیطی با شیشه‌های فتولتائیک خودتمیزشونده و نمای آئینه‌ای منعکس‌کننده امواج خلیج فارس. دارای باغ‌های معلق طبقاتی و تهویه هوشمند نسیم خلیج.",
      descriptionEn: "Multi-functional eco sky-towers featuring self-cleaning photovoltaic kinetic glass reflecting the Gulf waters.",
      specs: [
        { label: "ارتفاع سازه", val: "680 متر" },
        { label: "ظرفیت جمعیت", val: "120,000 شهروند" },
        { label: "تولید انرژی خورشیدی", val: "4.8 گیگاوات/ساعت" },
        { label: "ردپای کربن", val: "-100% (کربرن منفی)" }
      ]
    },
    {
      id: "sky-farms",
      nameFa: "مزرعه‌های عمودی هیدروپونیک معلق",
      nameEn: "Suspended Vertical Bio-Farms",
      category: "farm",
      position: new THREE.Vector3(-30, 48, -25),
      descriptionFa: "سیلندرهای سبز شیشه‌ای شناور در طبقات فوقانی جو، ارتقادهنده امنیت غذایی ارگانیک شهر با آبیاری چرخه‌ای شرب از تقطیر بخار آب خلیج فارس.",
      descriptionEn: "Spiral vertical bio-domes suspended in sky levels utilizing desalinated Gulf moisture and zero-gravity magnetic hydroponics.",
      specs: [
        { label: "تولید غذا ارگانیک", val: "1,200 تن در ماه" },
        { label: "کاهش مصرف آب", val: "95% نسبت به کشاورزی سنتی" },
        { label: "تولید اکسیژن خالص", val: "850,000 مترمکعب روزانه" }
      ]
    },
    {
      id: "monorail-track",
      nameFa: "شبکه مونوریل و راهکارهای آسمانی (Skyways)",
      nameEn: "Elevated Monorails & Luminescent Skyways",
      category: "monorail",
      position: new THREE.Vector3(15, 22, 20),
      descriptionFa: "خطوط راه‌آهن شناور مغناطیسی (Maglev) شفاف با سرعت 280 کیلومتر بر ساعت که کلیه برج‌ها را بدون تولید آلودگی صوتی یا کربنی به یکدیگر متصل می‌کند.",
      descriptionEn: "High-speed silent Maglev monorails crossing luminescent sky-bridges to interconnect all eco-towers seamlessly.",
      specs: [
        { label: "سرعت جابجایی", val: "280 km/h" },
        { label: "منبع تغذیه", val: "القای مغناطیسی خورشیدی" },
        { label: "زمان انتظار ایستگاه", val: "15 ثانیه" }
      ]
    },
    {
      id: "flying-taxis",
      nameFa: "کرپشت‌های تاکسی پرنده هوشمند (eVTOL Corridor)",
      nameEn: "Autonomous eVTOL Flying Taxi Corridors",
      category: "taxi",
      position: new THREE.Vector3(25, 42, -10),
      descriptionFa: "دالان‌های هوایی اختصاصی هدایت شونده با هوش مصنوعی برای تاکسی‌های پرنده خودران بدون خلبان، مجهز به باتری‌های حالت جامد و فرودگاه‌های عمودی (Vertiports) در بام برج‌ها.",
      descriptionEn: "AI-guided 3D sky traffic channels for autonomous electric VTOL flying taxis equipped with solid-state batteries.",
      specs: [
        { label: "تعداد دالان فعال", val: "16 ردیف ارتفاعی" },
        { label: "ایمنی پرواز AI", val: "99.999%" },
        { label: "مدت زمان شارژ سریع", val: "3 دقیقه در سکو" }
      ]
    },
    {
      id: "underwater-domes",
      nameFa: "سازه‌های زیرآبی گنبدی خلیج فارس",
      nameEn: "Gulf Submerged Glass Bio-Domes",
      category: "underwater",
      position: new THREE.Vector3(-20, -8, 35),
      descriptionFa: "زیست‌گاه‌های شفاف زیرآبی مستقر در آب‌های فیروزه‌ای خلیج فارس شامل آزمایشگاه‌های احیای مرجان، هتل‌های آکواریومی و سیستم‌های شیرین‌سازی آب.",
      descriptionEn: "Submerged glass habitats anchored on the Persian Gulf seabed featuring coral restoration labs and non-disruptive osmosis filtration.",
      specs: [
        { label: "عمق استقرار", val: "25 متر زیر سطح دریا" },
        { label: "مقاومت فشار شیشه", val: "کوارتز تقویت‌شده 120mm" },
        { label: "شیرین‌سازی آب", val: "500,000 لیتر در روز" }
      ]
    },
    {
      id: "beachfront-promenade",
      nameFa: "ساحل هوشمند و مبدل‌های انرژی موج",
      nameEn: "Smart Palm Beachfront & Tidal Power Shore",
      category: "beach",
      position: new THREE.Vector3(0, 2, 50),
      descriptionFa: "نوار ساحلی زرین خلیج فارس با درختان نخل خورشیدی، سنگفرش‌های پیزوالکتریک تولیدکننده برق از گام‌های شهروندان و مبدل‌های هیدرودینامیکی انرژی امواج دریا.",
      descriptionEn: "Golden Gulf coastline lined with solar palms and kinetic wave surge absorbers.",
      specs: [
        { label: "طول خط ساحلی", val: "12 کیلومتر" },
        { label: "درختان نخل خورشیدی", val: "3,500 اصله نخل هوشمند" },
        { label: "تولید برق امواج", val: "1.2 گیگاوات" }
      ]
    }
  ];

  // Soundscape Toggle
  const toggleSoundscape = () => {
    if (!soundscapeActive) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(110, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(15, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        lfo.start();

        osc1Ref.current = osc;
        setSoundscapeActive(true);

        if (speakHomePersonaText) {
          speakHomePersonaText("صدای محیطی خلیج فارس آینده و تاکسی‌های پرنده فعال گردید.");
        }
      } catch (e) {
        console.error("Audio synth error", e);
      }
    } else {
      if (osc1Ref.current) {
        try {
          osc1Ref.current.stop();
        } catch (e) {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
      setSoundscapeActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch(e){}
      }
    };
  }, []);

  // Three.js 3D Engine Setup
  useEffect(() => {
    if (!mountRef.current || activeViewTab !== "3d") return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(timeOfDay === "night" ? 0x070b19 : 0xf0aa70, 0.0035);

    // Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 40, 110);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(
      timeOfDay === "night" ? 0x1a264a : timeOfDay === "golden" ? 0xffd1a4 : 0xffffff,
      timeOfDay === "night" ? 0.8 : 1.4
    );
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(
      timeOfDay === "night" ? 0x4f70e8 : timeOfDay === "golden" ? 0xff7b00 : 0xfffae0,
      timeOfDay === "night" ? 0.6 : 2.5
    );
    mainSun.position.set(
      timeOfDay === "golden" ? 120 : 50,
      timeOfDay === "golden" ? 35 : 120,
      timeOfDay === "golden" ? -100 : -50
    );
    mainSun.castShadow = true;
    scene.add(mainSun);

    // Water Surface (Persian Gulf)
    const waterGeo = new THREE.PlaneGeometry(350, 350, 64, 64);
    const waterMat = new THREE.MeshStandardMaterial({
      color: timeOfDay === "night" ? 0x052a36 : 0x008080,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.88
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0;
    scene.add(water);

    // Golden Beach Shore
    const beachGeo = new THREE.BoxGeometry(350, 2, 80);
    const beachMat = new THREE.MeshStandardMaterial({ color: 0xdfb877, roughness: 0.9 });
    const beach = new THREE.Mesh(beachGeo, beachMat);
    beach.position.set(0, 0.5, 70);
    scene.add(beach);

    // BUILDINGS & TOWERS GROUP
    const towersGroup = new THREE.Group();
    scene.add(towersGroup);

    // Central Iconic Eco Sky-Tower (Mana Wisdom Tower)
    const towerGeo = new THREE.CylinderGeometry(6, 14, 80, 16);
    const towerMat = new THREE.MeshPhysicalMaterial({
      color: 0x0e1d38,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      transmission: 0.3,
      opacity: 0.95,
      transparent: true,
      emissive: timeOfDay === "night" ? 0x113366 : 0x051525
    });
    const mainTower = new THREE.Mesh(towerGeo, towerMat);
    mainTower.position.set(0, 40, 0);
    mainTower.castShadow = true;
    towersGroup.add(mainTower);

    // Glowing Rings around main tower
    for (let r = 0; r < 5; r++) {
      const ringGeo = new THREE.TorusGeometry(8 + r * 1.5, 0.4, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? 0x00f3ff : 0xff00bb
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 15 + r * 14, 0);
      towersGroup.add(ring);
    }

    // Surrounding Eco Skyscrapers
    const buildingPositions = [
      { x: -25, z: -15, h: 55, r: 5, c: 0x12243e },
      { x: 25, z: -20, h: 60, r: 6, c: 0x182c48 },
      { x: -35, z: 15, h: 45, r: 5.5, c: 0x0d2838 },
      { x: 35, z: 10, h: 50, r: 5, c: 0x1e203f },
      { x: -12, z: -35, h: 65, r: 7, c: 0x152a42 },
      { x: 18, z: -38, h: 70, r: 6.5, c: 0x102538 }
    ];

    buildingPositions.forEach((b) => {
      const bGeo = new THREE.BoxGeometry(b.r * 2, b.h, b.r * 2);
      const bMat = new THREE.MeshStandardMaterial({
        color: b.c,
        metalness: 0.8,
        roughness: 0.2,
        emissive: timeOfDay === "night" ? 0x091d33 : 0x000000
      });
      const building = new THREE.Mesh(bGeo, bMat);
      building.position.set(b.x, b.h / 2, b.z);
      building.castShadow = true;
      towersGroup.add(building);
    });

    // SUSPENDED SKY FARMS
    const skyFarmGroup = new THREE.Group();
    scene.add(skyFarmGroup);

    const farmDomeGeo = new THREE.SphereGeometry(7, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const farmDomeMat = new THREE.MeshPhysicalMaterial({
      color: 0x34d399,
      transmission: 0.7,
      opacity: 0.9,
      transparent: true,
      roughness: 0.1,
      emissive: 0x064e3b
    });

    [{ x: -30, y: 48, z: -25 }, { x: 30, y: 52, z: -25 }].forEach((f) => {
      const farmDome = new THREE.Mesh(farmDomeGeo, farmDomeMat);
      farmDome.position.set(f.x, f.y, f.z);
      skyFarmGroup.add(farmDome);
    });

    // MONORAIL & SKYWAY TRACKS
    const skywayGroup = new THREE.Group();
    scene.add(skywayGroup);

    const trackCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-60, 22, 30),
      new THREE.Vector3(-35, 25, 10),
      new THREE.Vector3(0, 28, 0),
      new THREE.Vector3(35, 25, 10),
      new THREE.Vector3(60, 22, 30),
      new THREE.Vector3(40, 20, 50),
      new THREE.Vector3(-40, 20, 50)
    ], true);

    const trackGeo = new THREE.TubeGeometry(trackCurve, 120, 0.8, 8, true);
    const trackMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    const track = new THREE.Mesh(trackGeo, trackMat);
    skywayGroup.add(track);

    // Monorail Pods
    const monorailPods: THREE.Mesh[] = [];
    const podGeo = new THREE.CapsuleGeometry(1.2, 5, 8, 16);
    const podMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x00f3ff
    });

    for (let p = 0; p < 3; p++) {
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.rotation.z = Math.PI / 2;
      skywayGroup.add(pod);
      monorailPods.push(pod);
    }

    // FLYING TAXIS
    const taxiGroup = new THREE.Group();
    scene.add(taxiGroup);

    const taxis: { mesh: THREE.Group; speed: number; orbitRadius: number; height: number; angle: number }[] = [];
    const taxiGeo = new THREE.BoxGeometry(2, 0.8, 3);
    const taxiMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xd97706
    });

    for (let i = 0; i < flyingTaxisCount; i++) {
      const taxiMeshGroup = new THREE.Group();
      const body = new THREE.Mesh(taxiGeo, taxiMat);
      taxiMeshGroup.add(body);

      const angle = (i / flyingTaxisCount) * Math.PI * 2;
      const radius = 35 + Math.random() * 30;
      const height = 25 + Math.random() * 30;

      taxiMeshGroup.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      taxiGroup.add(taxiMeshGroup);

      taxis.push({
        mesh: taxiMeshGroup,
        speed: 0.008 + Math.random() * 0.006,
        orbitRadius: radius,
        height,
        angle
      });
    }

    // Interactive Drag Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngleX = 0;
    let cameraAngleY = 0.3;
    let cameraDistance = 110;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || cameraMode !== "orbit") return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      cameraAngleX -= deltaX * 0.005;
      cameraAngleY = Math.max(-0.2, Math.min(1.2, cameraAngleY + deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e: WheelEvent) => {
      cameraDistance = Math.max(30, Math.min(220, cameraDistance + e.deltaY * 0.08));
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvasEl.addEventListener("wheel", onWheel);

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate Monorail
      monorailPods.forEach((pod, idx) => {
        const t = (elapsedTime * 0.05 * monorailSpeed + idx * 0.33) % 1;
        const pos = trackCurve.getPointAt(t);
        const tangent = trackCurve.getTangentAt(t);
        pod.position.copy(pos);
        pod.lookAt(pos.clone().add(tangent));
      });

      // Animate Flying Taxis
      taxis.forEach((t) => {
        if (isAnimating) t.angle += t.speed;
        t.mesh.position.x = Math.cos(t.angle) * t.orbitRadius;
        t.mesh.position.z = Math.sin(t.angle) * t.orbitRadius;
        t.mesh.position.y = t.height + Math.sin(elapsedTime * 2 + t.angle) * 1.5;
        t.mesh.rotation.y = -t.angle + Math.PI / 2;
      });

      if (isAnimating) {
        mainTower.rotation.y += 0.002;
      }

      // Camera Modes
      if (cameraMode === "orbit") {
        camera.position.x = Math.sin(cameraAngleX) * Math.cos(cameraAngleY) * cameraDistance;
        camera.position.z = Math.cos(cameraAngleX) * Math.cos(cameraAngleY) * cameraDistance;
        camera.position.y = Math.sin(cameraAngleY) * cameraDistance + 10;
        camera.lookAt(0, 25, 0);
      } else if (cameraMode === "tour") {
        const tourAngle = elapsedTime * 0.12;
        camera.position.x = Math.sin(tourAngle) * 95;
        camera.position.z = Math.cos(tourAngle) * 95;
        camera.position.y = 35 + Math.sin(elapsedTime * 0.2) * 10;
        camera.lookAt(0, 30, 0);
      } else if (cameraMode === "monorail") {
        const t = (elapsedTime * 0.08) % 1;
        const pos = trackCurve.getPointAt(t);
        const tangent = trackCurve.getTangentAt(t);
        camera.position.copy(pos).add(new THREE.Vector3(0, 2, 0));
        camera.lookAt(pos.clone().add(tangent).add(new THREE.Vector3(0, 1, 0)));
      } else if (cameraMode === "taxi") {
        if (taxis.length > 0) {
          const firstTaxi = taxis[0].mesh;
          camera.position.copy(firstTaxi.position).add(new THREE.Vector3(0, 3, 8));
          camera.lookAt(firstTaxi.position);
        }
      } else if (cameraMode === "underwater") {
        camera.position.set(-20, -14, 35);
        camera.lookAt(-20, 20, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvasEl.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvasEl.removeEventListener("wheel", onWheel);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [timeOfDay, cameraMode, isAnimating, flyingTaxisCount, monorailSpeed, waterTurbulence, activeViewTab]);

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-cyan-950 p-6 md:p-8 border border-amber-500/30 shadow-2xl">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-950/90 rounded-2xl border border-amber-500/40 text-amber-400 shadow-lg shadow-amber-950/50">
                <Globe className="w-6 h-6 animate-spin" style={{ animationDuration: "20s" }} />
              </div>
              <div>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-0.5 rounded-md font-mono font-extrabold tracking-wider">
                  PERSIAN GULF FUTURISTIC ECO-SYSTEM 3D MODEL
                </span>
                <h2 className="text-lg md:text-xl font-extrabold text-slate-100 mt-1">
                  مدل سه بعدی شبیه‌ساز ابرشهر زیست‌محیطی خلیج فارس
                </h2>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveViewTab("3d")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeViewTab === "3d"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>شبیه‌ساز تعاملی 3D WebGL</span>
              </button>

              <button
                onClick={() => setActiveViewTab("render")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeViewTab === "render"
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-950/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>رندر فتورئالیستیک 8K</span>
              </button>
            </div>
          </div>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed text-justify font-light">
            مدل و ارائه سه‌بعدی کامل از اکوسیستم هوشمند و مدرن شهر خلیج فارس آینده. شامل خطوط مونوریل معلق، پل‌های آسمانی (Skyways)، دالان‌های تاکسی پرنده خودران (eVTOL)، سازه‌های گنبدی شفاف زیرآبی، مزارع عمودی هیدروپونیک شناور در جو، و نوار ساحلی تولیدکننده انرژی از امواج دریا.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5">
              <Train className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">شبکه مونوریل</span>
                <span className="text-xs font-mono font-extrabold text-cyan-300">280 km/h Maglev</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5">
              <Plane className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">تاکسی‌های پرنده</span>
                <span className="text-xs font-mono font-extrabold text-amber-300">eVTOL 100% AI</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5">
              <Waves className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">گنبدهای زیرآبی</span>
                <span className="text-xs font-mono font-extrabold text-teal-300">25m Depth Reefs</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5">
              <Trees className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">مزارع عمودی جو</span>
                <span className="text-xs font-mono font-extrabold text-emerald-300">Hydro-Bio Domes</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">تولید انرژی پاک</span>
                <span className="text-xs font-mono font-extrabold text-yellow-300">6.0 GW Pure Solar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW CONTENT */}
      {activeViewTab === "3d" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* MAIN 3D CANVAS STAGE */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl h-[550px]">
              
              {/* Three.js Mount Canvas */}
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

              {/* OVERLAY CONTROLS ON CANVAS */}
              <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl text-xs">
                <span className="text-[10px] text-slate-400 font-bold px-2">زاویه دوربین:</span>
                
                <button
                  onClick={() => setCameraMode("orbit")}
                  className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                    cameraMode === "orbit" ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  <span>آزاد (Orbit)</span>
                </button>

                <button
                  onClick={() => setCameraMode("tour")}
                  className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                    cameraMode === "tour" ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>تور هوایی</span>
                </button>

                <button
                  onClick={() => setCameraMode("monorail")}
                  className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                    cameraMode === "monorail" ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Train className="w-3 h-3" />
                  <span>سوار بر مونوریل</span>
                </button>

                <button
                  onClick={() => setCameraMode("taxi")}
                  className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                    cameraMode === "taxi" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Plane className="w-3 h-3" />
                  <span>پرواز تاکسی</span>
                </button>

                <button
                  onClick={() => setCameraMode("underwater")}
                  className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                    cameraMode === "underwater" ? "bg-teal-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Waves className="w-3 h-3" />
                  <span>زیر دریا</span>
                </button>
              </div>

              {/* Time of Day & Audio Toggle Top Left */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl text-xs">
                <button
                  onClick={() => setTimeOfDay("golden")}
                  className={`p-1.5 rounded-xl transition ${timeOfDay === "golden" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:bg-slate-800"}`}
                  title="غروب طلایی خلیج فارس"
                >
                  <Sun className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setTimeOfDay("night")}
                  className={`p-1.5 rounded-xl transition ${timeOfDay === "night" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
                  title="شب نئونی سایبرپانک"
                >
                  <Moon className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setTimeOfDay("noon")}
                  className={`p-1.5 rounded-xl transition ${timeOfDay === "noon" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:bg-slate-800"}`}
                  title="روز آفتابی خلیج فارس"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-800 mx-1" />

                <button
                  onClick={toggleSoundscape}
                  className={`p-1.5 rounded-xl transition flex items-center gap-1 font-bold ${
                    soundscapeActive ? "bg-emerald-600 text-white animate-pulse" : "text-slate-400 hover:bg-slate-800"
                  }`}
                  title="صداهای محیطی خلیج فارس آینده"
                >
                  {soundscapeActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Bottom Instructions Badge */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>راهنما: با کلیک و کشیدن ماوس مدل را بچرخانید، با غلتک ماوس زوم کنید و زوایای دوربین مختلف را امتحان کنید.</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">3D ENGINE: THREE.JS WEBGL</span>
                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-1"
                  >
                    {isAnimating ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                    <span>{isAnimating ? "توقف پویانمایی" : "شروع پویانمایی"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SLIDERS & REALTIME SIMULATION CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-slate-100 font-bold text-sm">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>تنظیمات و متغیرهای شبیه‌ساز زنده خلیج فارس</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Taxi Count Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>تراکم تاکسی‌های پرنده (eVTOL):</span>
                    <span className="text-amber-400 font-mono font-bold">{flyingTaxisCount} ناوگان</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={30}
                    value={flyingTaxisCount}
                    onChange={(e) => setFlyingTaxisCount(Number(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                {/* Monorail Speed */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>سرعت حرکت مونوریل مگلو:</span>
                    <span className="text-cyan-400 font-mono font-bold">{monorailSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={3.0}
                    step={0.1}
                    value={monorailSpeed}
                    onChange={(e) => setMonorailSpeed(Number(e.target.value))}
                    className="w-full accent-cyan-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                {/* Water Waves */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>تلاطم امواج آب خلیج فارس:</span>
                    <span className="text-teal-400 font-mono font-bold">{waterTurbulence.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={2.5}
                    step={0.1}
                    value={waterTurbulence}
                    onChange={(e) => setWaterTurbulence(Number(e.target.value))}
                    className="w-full accent-teal-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR: HOTSPOTS INSPECTOR & ARCHITECTURAL SPECS */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-slate-100 font-bold text-sm">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>نقاط کلیدی اکوسیستم شهر</span>
              </div>

              <div className="space-y-2">
                {hotspots.map((hs) => (
                  <button
                    key={hs.id}
                    onClick={() => setSelectedHotspot(hs)}
                    className={`w-full text-right p-3 rounded-2xl border text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                      selectedHotspot?.id === hs.id
                        ? "bg-amber-950/60 border-amber-500/50 text-amber-200 shadow-md"
                        : "bg-slate-950/60 border-slate-850 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {hs.category === "tower" && <Building2 className="w-4 h-4 text-amber-400 shrink-0" />}
                      {hs.category === "farm" && <Trees className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {hs.category === "monorail" && <Train className="w-4 h-4 text-cyan-400 shrink-0" />}
                      {hs.category === "taxi" && <Plane className="w-4 h-4 text-yellow-400 shrink-0" />}
                      {hs.category === "underwater" && <Waves className="w-4 h-4 text-teal-400 shrink-0" />}
                      {hs.category === "beach" && <Sun className="w-4 h-4 text-amber-400 shrink-0" />}
                      <span className="font-bold">{hs.nameFa}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* HOTSPOT DETAIL INSPECTION CARD */}
            <AnimatePresence mode="wait">
              {selectedHotspot && (
                <motion.div
                  key={selectedHotspot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-5 shadow-2xl space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-mono font-bold">
                      {selectedHotspot.category.toUpperCase()} SPECIFICATION
                    </span>
                    <button
                      onClick={() => setSelectedHotspot(null)}
                      className="text-slate-400 hover:text-slate-200 text-xs font-bold"
                    >
                      بستن
                    </button>
                  </div>

                  <h3 className="text-sm font-extrabold text-amber-300">
                    {selectedHotspot.nameFa}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed text-justify">
                    {selectedHotspot.descriptionFa}
                  </p>

                  <div className="space-y-2 pt-1 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 block">مشخصات فنی و پایداری:</span>
                    {selectedHotspot.specs.map((sp, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs bg-slate-950/80 p-2 rounded-xl border border-slate-850">
                        <span className="text-slate-400">{sp.label}:</span>
                        <span className="text-emerald-400 font-mono font-bold">{sp.val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}

      {/* RENDER SHOWCASE VIEW TAB */}
      {activeViewTab === "render" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-cyan-400" />
              <div>
                <h3 className="text-base font-extrabold text-slate-100">
                  رندر معماری فتورئالیستیک خلیج فارس (8K Render Showcase)
                </h3>
                <p className="text-xs text-slate-400">
                  تصویرسازی کیفیت بالا از نمای ساحلی، برج‌های خورشیدی، مونوریل‌ها و سازه‌های شیشه‌ای زیرآبی در زمان غروب زرین.
                </p>
              </div>
            </div>

            <a
              href={persianGulfCityImg}
              download="Persian_Gulf_Futuristic_Eco_City_Render.jpg"
              className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>دانلود تصویر با کیفیت کامل</span>
            </a>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
            <img
              src={persianGulfCityImg}
              alt="Persian Gulf Futuristic City 3D Render"
              className="w-full h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 right-6 left-6 flex flex-wrap items-center justify-between gap-3 text-slate-100">
              <div>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                  8K CONCEPTUAL RENDER
                </span>
                <h4 className="text-lg font-black text-white">
                  ابرشهر زیست‌محیطی خلیج فارس - Persian Gulf Metropolis
                </h4>
              </div>

              <div className="flex items-center gap-3 text-xs bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ترکیب هماهنگ معماری خلیج فارس، انرژی خورشیدی و هوش مصنوعی</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
