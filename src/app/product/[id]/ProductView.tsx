'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ShoppingCart,
    MessageCircle,
    ShieldCheck,
    Truck,
    Package,
    Info,
    ArrowRight,
    Search,
    FileText,
    Download
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product, ItemSize, Shade } from '@/types';
import { useCartStore } from '@/lib/store';
import { ShadeSelector } from '@/components/ShadeSelector';
import { SimpleVisualizer } from '@/components/SimpleVisualizer';
import { PaintCalculator } from '@/components/PaintCalculator';
import Link from 'next/link';
import { trackProductView, RecentlyViewed } from '@/components/RecentlyViewed';
import { cn } from '@/lib/utils';
import { BRIGHTO_SHADES, BRIGHTO_ENAMEL_SHADES, BRIGHTO_PLASTIC_EMULSION_SHADES, BRIGHTO_ALL_WEATHER_SHADES, SAASI_HYDROUS_SHADES, SAASI_MATT_ENAMEL_SHADES, SAASI_PLASTIC_EMULSION_SHADES, SAASI_SUPER_GLOSS_ENAMEL_SHADES, SAASI_WEATHER_SAFE_SHADES, GOBIS_INDUSTRIAL_ENAMEL_SHADES, GOBIS_STOVING_PAINT_SHADES, GOBIS_CARMAN_SERIES_SHADES, GOBIS_SILVERLINE_ENAMEL_SHADES, GOBIS_SILVERLINE_EMULSION_SHADES, GOBIS_GOLD_LUXURIOUS_WALL_EMULSION_SHADES, GOBIS_SILKSHEEN_EMULSION_SHADES, GOBIS_GOLD_ENAMEL_SHADES, GOBIS_AQUEOUS_MATT_FINISH_SHADES, GOBIS_GOLD_AQUEOUS_MATT_FINISH_SHADES, GOBIS_GOLD_EGGSHELL_MATT_FINISH_SHADES, GOBIS_GLOSS_ENAMEL_SHADES, GOBIS_EGGSHELL_MATT_ENAMEL_SHADES, RELIABLE_WEATHER_PROTECTOR_SHADES, RELIABLE_MATT_ENAMEL_SHADES, RELIABLE_EMULSION_SHADES, RELIABLE_ENAMEL_SHADES, RELIABLE_WATER_MATT_SHADES, CHOICE_SYNTHETIC_ENAMEL_SHADES, CHOICE_WEATHER_SEALER_SHADES, RELIANCE_STAINLESS_MATT_SHADES, RELIANCE_SEMI_PLASTIC_EMULSION_SHADES, RELIANCE_MATT_ENAMEL_SHADES, RELIANCE_WEATHER_GUARD_SHADES, RELIANCE_SYNTHETIC_ENAMEL_SHADES, BERGER_WEATHER_PRO_SHADES, BERGER_NU_ENAMEL_SHADES, BERGER_NU_EMULSION_SHADES, BERGER_ELEGANCE_SILK_EMULSION_SHADES, BERGER_SUPERIOR_MATT_FINISH_SHADES, DIAMOND_ACE_WEATHER_DEFENDER_SHADES, DIAMOND_OVERALL_PLASTICCOAT_EMULSION_SHADES, DIAMOND_ACE_ACRYLIC_PLASTIC_EMULSION_SHADES, DIAMOND_ACE_MATT_ENAMEL_SHADES, DIAMOND_ACE_SUPER_GLOSS_ENAMEL_SHADES, DIAMOND_OVERALL_SUPER_EMULSION_SHADES, DIAMOND_OVERALL_HIGH_GLOSS_ENAMEL_SHADES, DIAMOND_OVERALL_WEATHER_MAX_SHADES, DIAMOND_EVERLAST_HIGH_GLOSS_ENAMEL_SHADES, DIAMOND_ACE_DURASILK_EMULSION_SHADES, DIAMOND_VALUE_EMULSION_SHADES, DIAMOND_OVERALL_MATT_ENAMEL_SHADES, DIAMOND_OVERALL_AQUAMAX_WATER_MATT_SHADES, DIAMOND_ACE_TIMBERLAC_WOOD_STAINS_SHADES, BERGER_WEATHER_COAT_GLOW_365_SHADES, BERGER_VIP_WEATHER_COAT_SHADES, BERGER_ALLROUNDER_MATT_ENAMEL_SHADES, BERGER_TOP_SUPER_EMULSION_SHADES, BERGER_SUPER_GLOSS_ENAMEL_SHADES, BERGER_SEMI_PLASTIC_EMULSION_SHADES, BERGER_ELEGANCE_MATT_EMULSION_SHADES } from '@/constants/shades';


export function ProductView({ initialId }: { initialId: string }) {
    const { id } = useParams() || { id: initialId };
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [shades, setShades] = useState<Shade[]>([]);
    const [selectedShade, setSelectedShade] = useState<Shade | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [activeTab, setActiveTab] = useState<'visualizer' | 'calculator'>('visualizer');

    const { addItem } = useCartStore();

    const isBrightoSuperEmulsion = product?.name === 'Brighto Super Emulsion';
    const isBrightoSyntheticEnamel = product?.name === 'Brighto Synthetic Enamel';
    const isBrightoPlasticEmulsion = product?.name === 'Brighto Plastic Emulsion';
    const isBrightoAllWeather = product?.name === 'Brighto All Weather';
    const isSaasiHydrous = product?.name?.includes('Hydrous Matt Finish');
    const isSaasiMattEnamel = product?.brand === 'Saasi' && product?.name === 'Matt Enamel';
    const isSaasiPlasticEmulsion = product?.brand === 'Saasi' && product?.name === 'Plastic Emulsion';
    const isSaasiSuperGlossEnamel = product?.brand === 'Saasi' && product?.name === 'Super Gloss Enamel';
    const isSaasiWeatherSafe = product?.brand === 'Saasi' && product?.name === 'Weather Safe';
    const isBrightoStainFree = product?.name === 'Brighto Stain Free royal silky finish emulsion';
    const isGobisIndustrialEnamel = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && (product?.name === 'Gobis Industrial Enamel Gloss Finish' || product?.name === 'Industrial Enamel Gloss Finish');
    const isGobisStovingPaint = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && (product?.name?.toLowerCase().includes('stoving paint'));
    const isGobisCarmanSeries = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && product?.name?.toLowerCase().includes('carman series');
    const isGobisSilverlineEnamel = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && product?.name?.toLowerCase().includes('silverline enamel');
    const isGobisSilverlineEmulsion = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && product?.name?.toLowerCase().includes('silverline emulsion');
    const isGobisGoldLuxuriousWallEmulsion = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && product?.name?.toLowerCase().includes('gold') && product?.name?.toLowerCase().includes('wall emulsion');
    const isGobisSilksheenEmulsion = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && product?.name?.toLowerCase().includes('silksheen emulsion');
    const isGobisGoldEnamel = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && product?.name?.toLowerCase().includes('gold') && product?.name?.toLowerCase().includes('enamel') && !product?.name?.toLowerCase().includes('wall emulsion');
    const isGobisAqueousMattFinish = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && product?.name?.toLowerCase().includes('aqueous matt finish') && !product?.name?.toLowerCase().includes('gold');
    const isGobisGoldAqueousMattFinish = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && product?.name?.toLowerCase().includes('gold') && product?.name?.toLowerCase().includes('aqueous matt finish');
    const isGobisGoldEggshellMattFinish = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && product?.name?.toLowerCase().includes('gold') && product?.name?.toLowerCase().includes('eggshell') && product?.name?.toLowerCase().includes('matt finish');
    const isGobisGlossEnamel = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && product?.name?.toLowerCase().includes('gloss enamel') && !product?.name?.toLowerCase().includes('gold');
    const isGobisEggshellMattEnamel = (product?.brand === "Gobi's" || product?.brand === 'Gobis') && product?.name?.toLowerCase().includes('eggshell') && product?.name?.toLowerCase().includes('enamel') && !product?.name?.toLowerCase().includes('gold');
    const isReliableWeatherProtector = product?.brand === 'Reliable' && (product?.name === 'Reliable Weather Protector' || product?.name === 'Reliable Ace Weather Defender');
    const isReliableMattEnamel = product?.brand === 'Reliable' && (product?.name === 'Reliable Matt Enamel' || product?.name === 'Reliable Matt Finish Inner');
    const isReliableEmulsion = product?.brand === 'Reliable' && product?.name === 'Reliable Emulsion';
    const isReliableEnamel = product?.brand === 'Reliable' && product?.name?.toLowerCase().includes('enamel') && !product?.name?.toLowerCase().includes('matt');
    const isReliableWaterMatt = product?.brand === 'Reliable' && product?.name?.toLowerCase().includes('water matt');
    const isChoiceSyntheticEnamel = (product?.brand === 'Choice' && product?.name?.toLowerCase().includes('synthetic enamel')) || product?.name?.toLowerCase().includes('choice synthetic enamel');
    const isChoiceWeatherSealer = product?.brand === 'Choice' && product?.name?.toLowerCase().includes('weather sealer');
    const isRelianceStainlessMatt = product?.brand === 'Reliance' && product?.name?.toLowerCase().includes('stainless matt');
    const isRelianceSemiPlasticEmulsion = product?.brand === 'Reliance' && product?.name?.toLowerCase().includes('semi plastic emulsion');
    const isRelianceMattEnamel = product?.brand === 'Reliance' && product?.name?.toLowerCase().includes('matt enamel');
    const isRelianceWeatherGuard = product?.brand === 'Reliance' && product?.name?.toLowerCase().includes('weather guard');
    const isRelianceSyntheticEnamel = product?.brand === 'Reliance' && product?.name?.toLowerCase().includes('synthetic enamel');
    const isBergerWeatherPro = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('weather pro');
    const isBergerNuEnamel = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('nu enamel');
    const isBergerNuEmulsion = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('nu emulsion');
    const isBergerEleganceSilkEmulsion = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('elegance silk emulsion');
    const isBergerEleganceMattEmulsion = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('elegance matt emulsion');
    const isBergerSuperiorMattFinish = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('superior matt finish');
    const isBergerWeatherCoatGlow365 = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('weather coat glow 365');
    const isBergerVipWeatherCoat = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('vip weather coat');
    const isBergerAllrounderMattEnamel = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('allrounder matt enamel');
    const isBergerTopSuperEmulsion = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('top super emulsion');
    const isBergerSuperGlossEnamel = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('super gloss enamel');
    const isBergerSemiPlasticEmulsion = product?.brand === 'Berger' && product?.name?.toLowerCase().includes('semi plastic emulsion');
    const isDiamondAceWeatherDefender = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('ace weather defender');
    const isDiamondOverallPlasticcoatEmulsion = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('overall plasticcoat emulsion');
    const isDiamondAceAcrylicPlasticEmulsion = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('ace acrylic plastic emulsion');
    const isDiamondAceMattEnamel = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('ace matt enamel');
    const isDiamondAceSuperGlossEnamel = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('ace super gloss enamel');
    const isDiamondOverallSuperEmulsion = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('overall super emulsion');
    const isDiamondOverallHighGlossEnamel = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('overall high gloss enamel');
    const isDiamondOverallWeatherMax = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('overall weather max');
    const isDiamondEverlastHighGlossEnamel = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('everlast high gloss enamel');
    const isDiamondAceDurasilkEmulsion = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('ace durasilk emulsion');
    const isDiamondValueEmulsion = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('value emulsion');
    const isDiamondOverallMattEnamel = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('overall matt enamel');
    const isDiamondOverallAquamaxWaterMatt = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('aquamax');
    const isDiamondAceTimberlacWoodStains = product?.brand === 'Diamond' && product?.name?.toLowerCase().includes('timberlac wood stain');
    const hasShadeCard = shades.length > 0 || isBrightoSuperEmulsion || isBrightoSyntheticEnamel || isBrightoPlasticEmulsion || isBrightoAllWeather || isSaasiHydrous || isSaasiMattEnamel || isSaasiPlasticEmulsion || isSaasiSuperGlossEnamel || isSaasiWeatherSafe || isBrightoStainFree || isGobisIndustrialEnamel || isGobisStovingPaint || isGobisCarmanSeries || isGobisSilverlineEnamel || isGobisSilverlineEmulsion || isGobisGoldLuxuriousWallEmulsion || isGobisSilksheenEmulsion || isGobisGoldEnamel || isGobisAqueousMattFinish || isGobisGoldAqueousMattFinish || isGobisGoldEggshellMattFinish || isGobisGlossEnamel || isGobisEggshellMattEnamel || isReliableWeatherProtector || isReliableMattEnamel || isReliableEmulsion || isReliableEnamel || isReliableWaterMatt || isChoiceSyntheticEnamel || isChoiceWeatherSealer || isRelianceStainlessMatt || isRelianceSemiPlasticEmulsion || isRelianceMattEnamel || isRelianceWeatherGuard || isRelianceSyntheticEnamel || isBergerWeatherPro || isBergerNuEnamel || isBergerNuEmulsion || isBergerEleganceSilkEmulsion || isBergerEleganceMattEmulsion || isBergerSuperiorMattFinish || isBergerWeatherCoatGlow365 || isBergerVipWeatherCoat || isBergerAllrounderMattEnamel || isBergerTopSuperEmulsion || isBergerSuperGlossEnamel || isBergerSemiPlasticEmulsion || isDiamondAceWeatherDefender || isDiamondOverallPlasticcoatEmulsion || isDiamondAceAcrylicPlasticEmulsion || isDiamondAceMattEnamel || isDiamondAceSuperGlossEnamel || isDiamondOverallSuperEmulsion || isDiamondOverallHighGlossEnamel || isDiamondOverallWeatherMax || isDiamondEverlastHighGlossEnamel || isDiamondAceDurasilkEmulsion || isDiamondValueEmulsion || isDiamondOverallMattEnamel || isDiamondOverallAquamaxWaterMatt || isDiamondAceTimberlacWoodStains;

    const shadeCardPdf = useMemo(() => {
        if (!product) return null;
        if (product.shade_card_url) return product.shade_card_url;
        const name = product.name;
        const brand = product.brand;

        if (brand === 'Brighto') {
            if (name === 'Brighto All Weather') return '/pdfs/brighto-all-weather.pdf';
            if (name === 'Brighto Plastic Emulsion') return '/pdfs/brighto-plastic-emulsion.pdf';
            if (name === 'Brighto Super Emulsion') return '/pdfs/brighto-super-emulsion.pdf';
            if (name === 'Brighto Synthetic Enamel') return '/pdfs/brighto-synthetic-enamel.pdf';
            if (name === 'Brighto Stain Free royal silky finish emulsion') return '/pdfs/brighto-stain-free.pdf';
        }

        if (brand === 'Diamond') {
            if (name.toLowerCase().includes('ace weather defender')) return '/pdfs/diamond_ace_weather_defender.pdf';
            if (name.toLowerCase().includes('overall plasticcoat emulsion')) return '/pdfs/diamond_overall_plasticcoat_emulsion.pdf';
            if (name.toLowerCase().includes('ace acrylic plastic emulsion')) return '/pdfs/diamond_ace_acrylic_plastic_emulsion.pdf';
            if (name.toLowerCase().includes('ace matt enamel')) return '/pdfs/diamond_ace_matt_enamel.pdf';
            if (name.toLowerCase().includes('ace super gloss enamel')) return '/pdfs/diamond_ace_super_gloss_enamel.pdf';
            if (name.toLowerCase().includes('overall super emulsion')) return '/pdfs/diamond_overall_super_emulsion.pdf';
            if (name.toLowerCase().includes('overall high gloss enamel')) return '/pdfs/diamond_overall_high_gloss_enamel.pdf';
            if (name.toLowerCase().includes('overall weather max')) return '/pdfs/diamond_overall_weather_max.pdf';
            if (name.toLowerCase().includes('everlast high gloss enamel')) return '/pdfs/diamond_everlast_high_gloss_enamel.pdf';
            if (name.toLowerCase().includes('ace durasilk emulsion')) return '/pdfs/diamond_ace_durasilk_emulsion.pdf';
            if (name.toLowerCase().includes('value emulsion')) return '/pdfs/diamond_value_emulsion.pdf';
            if (name.toLowerCase().includes('overall matt enamel')) return '/pdfs/diamond_overall_matt_enamel.pdf';
            if (name.toLowerCase().includes('aquamax')) return '/pdfs/diamond_overall_aquamax_water_matt.pdf';
            if (name.toLowerCase().includes('timberlac wood stain')) return '/pdfs/diamond_Ace_Timberlac_Wood_Stains.pdf';
        }

        if (brand === 'Saasi') {
            if (name.includes('Hydrous Matt Finish')) return '/pdfs/saasi-hydrous-matt-finish.pdf';
            if (name === 'Matt Enamel') return '/pdfs/saasi-matt-enamel.pdf';
            if (name === 'Plastic Emulsion') return '/pdfs/saasi-plastic-emulsion.pdf';
            if (name === 'Super Gloss Enamel') return '/pdfs/saasi-super-gloss-enamel.pdf';
            if (name === 'Weather Safe') return '/pdfs/saasi-weather-safe.pdf';
        }

        if (brand === "Gobi's" || brand === 'Gobis') {
            if (name === 'Gobis Industrial Enamel Gloss Finish' || name === 'Industrial Enamel Gloss Finish') return '/pdfs/gobis-industrial-enamel.pdf';
            if (name?.toLowerCase().includes('stoving paint')) return '/pdfs/gobis-stoving-paint.pdf';
            if (name?.toLowerCase().includes('carman series')) return '/pdfs/gobis-carman-series.pdf';
            if (name?.toLowerCase().includes('silverline enamel')) return '/pdfs/gobis-silverline-enamel.pdf';
            if (name?.toLowerCase().includes('silverline emulsion')) return '/pdfs/gobis-silverline-emulsion.pdf';
            if (name?.toLowerCase().includes('gold') && name?.toLowerCase().includes('wall emulsion')) return '/pdfs/gobis-gold-luxurious-wall-emulsion.pdf';
            if (name?.toLowerCase().includes('silksheen emulsion')) return '/pdfs/gobis-silksheen-emulsion.pdf';
            if (name?.toLowerCase().includes('gold') && name?.toLowerCase().includes('enamel') && !name?.toLowerCase().includes('wall emulsion')) return '/pdfs/gobis-gold-enamel.pdf';
            if (name?.toLowerCase().includes('aqueous matt finish') && !name?.toLowerCase().includes('gold')) return '/pdfs/gobis-aqueous-matt-finish.pdf';
            if (name?.toLowerCase().includes('gold') && name?.toLowerCase().includes('aqueous matt finish')) return '/pdfs/gobis-gold-aqueous-matt-finish.pdf';
            if (name?.toLowerCase().includes('gold') && name?.toLowerCase().includes('eggshell') && name?.toLowerCase().includes('matt finish')) return '/pdfs/gobis-gold-eggshell-matt-finish.pdf';
            if (name?.toLowerCase().includes('gloss enamel') && !name?.toLowerCase().includes('gold')) return '/pdfs/gobis-gloss-enamel.pdf';
            if (name?.toLowerCase().includes('eggshell') && name?.toLowerCase().includes('enamel') && !name?.toLowerCase().includes('gold')) return '/pdfs/gobis-eggshell-matt-enamel.pdf';
        }

        if (brand === 'Reliable') {
            if (name === 'Reliable Weather Protector' || name === 'Reliable Ace Weather Defender') return '/pdfs/reliable-weather-protector.pdf';
            if (name === 'Reliable Matt Enamel' || name === 'Reliable Matt Finish Inner') return '/pdfs/reliable-matt-enamel.pdf';
            if (name === 'Reliable Emulsion') return '/pdfs/reliable_emulsion.pdf';
            if (name.toLowerCase().includes('water matt')) return '/pdfs/reliable_water_matt.pdf';
            if (name.toLowerCase().includes('enamel') && !name.toLowerCase().includes('matt')) return '/pdfs/reliable_enamel.pdf';
        }
        if ((brand === 'Choice' && name.toLowerCase().includes('synthetic enamel')) || name.toLowerCase().includes('choice synthetic enamel')) return '/pdfs/choice_synthetic_enamel.pdf';
        if (brand === 'Choice' && name.toLowerCase().includes('weather sealer')) return '/pdfs/choice_weather_sealer.pdf';

        if (brand === 'Reliance' && name.toLowerCase().includes('stainless matt')) return '/pdfs/Reliance_stainless_matt.pdf';
        if (brand === 'Reliance' && name.toLowerCase().includes('semi plastic emulsion')) return '/pdfs/Reliance-Semi-Plastic-Emulsion.pdf';
        if (brand === 'Reliance' && name.toLowerCase().includes('matt enamel')) return '/pdfs/Reliance_Matt_Enamel.pdf';
        if (brand === 'Reliance' && name.toLowerCase().includes('synthetic enamel')) return '/pdfs/reliance_synthetic_enamel.pdf';
        if (brand === 'Berger' && name.toLowerCase().includes('weather pro')) return '/pdfs/berger_weather_pro.pdf';
        if (brand === 'Berger') {
            if (name.toLowerCase().includes('weather pro')) return '/pdfs/berger_weather_pro.pdf';
            if (name.toLowerCase().includes('nu enamel')) return '/pdfs/berger_nu_enamel.pdf';
            if (name.toLowerCase().includes('nu emulsion')) return '/pdfs/berger_nu_emulsion.pdf';
            if (name.toLowerCase().includes('elegance silk emulsion')) return '/pdfs/berger_elegance_silk_emulsion.pdf';
            if (name.toLowerCase().includes('elegance matt emulsion')) return '/pdfs/berger_Elegance_Matt_Emulsion.pdf';
            if (name.toLowerCase().includes('superior matt finish')) return '/pdfs/berger_superior_matt_finish.pdf';
            if (name.toLowerCase().includes('weather coat glow 365')) return '/pdfs/berger_Weather_coat_Glow_365.pdf';
            if (name.toLowerCase().includes('vip weather coat')) return '/pdfs/berger_vip_Weather_coat.pdf';
            if (name.toLowerCase().includes('allrounder matt enamel')) return '/pdfs/berger_allrounder_matt_enamel.pdf';
            if (name.toLowerCase().includes('top super emulsion')) return '/pdfs/berger_top_super_emulsion.pdf';
            if (name.toLowerCase().includes('super gloss enamel')) return '/pdfs/berger_super_gloss_enamel.pdf';
            if (name.toLowerCase().includes('semi plastic emulsion')) return '/pdfs/berger_Semi_Plastic_Emulsion.pdf';
        }

        return null;
    }, [product]);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const supabase = createClient();

            const { data: productData } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (productData) {
                setProduct(productData);

                let defaultShades: Shade[] = [];
                if (productData.name === 'Brighto Super Emulsion') defaultShades = BRIGHTO_SHADES;
                else if (productData.name === 'Brighto Synthetic Enamel') defaultShades = BRIGHTO_ENAMEL_SHADES;
                else if (productData.name === 'Brighto Plastic Emulsion') defaultShades = BRIGHTO_PLASTIC_EMULSION_SHADES;
                else if (productData.name === 'Brighto All Weather') defaultShades = BRIGHTO_ALL_WEATHER_SHADES;
                else if (productData.name.includes('Hydrous Matt Finish')) defaultShades = SAASI_HYDROUS_SHADES;
                else if (productData.brand === 'Saasi' && productData.name === 'Matt Enamel') defaultShades = SAASI_MATT_ENAMEL_SHADES;
                else if (productData.brand === 'Saasi' && productData.name === 'Plastic Emulsion') defaultShades = SAASI_PLASTIC_EMULSION_SHADES;
                else if (productData.brand === 'Saasi' && productData.name === 'Super Gloss Enamel') defaultShades = SAASI_SUPER_GLOSS_ENAMEL_SHADES;
                else if (productData.brand === 'Saasi' && productData.name === 'Weather Safe') defaultShades = SAASI_WEATHER_SAFE_SHADES;
                else if (productData.name === 'Brighto Stain Free royal silky finish emulsion') defaultShades = BRIGHTO_PLASTIC_EMULSION_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && (productData.name === 'Gobis Industrial Enamel Gloss Finish' || productData.name === 'Industrial Enamel Gloss Finish')) defaultShades = GOBIS_INDUSTRIAL_ENAMEL_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && (productData.name?.toLowerCase().includes('stoving paint'))) defaultShades = GOBIS_STOVING_PAINT_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && productData.name?.toLowerCase().includes('carman series')) defaultShades = GOBIS_CARMAN_SERIES_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && productData.name?.toLowerCase().includes('silverline enamel')) defaultShades = GOBIS_SILVERLINE_ENAMEL_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && productData.name?.toLowerCase().includes('silverline emulsion')) defaultShades = GOBIS_SILVERLINE_EMULSION_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && productData.name?.toLowerCase().includes('gold') && productData.name?.toLowerCase().includes('wall emulsion')) defaultShades = GOBIS_GOLD_LUXURIOUS_WALL_EMULSION_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && productData.name?.toLowerCase().includes('silksheen emulsion')) defaultShades = GOBIS_SILKSHEEN_EMULSION_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && productData.name?.toLowerCase().includes('gold') && productData.name?.toLowerCase().includes('enamel') && !productData.name?.toLowerCase().includes('wall emulsion')) defaultShades = GOBIS_GOLD_ENAMEL_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && productData.name?.toLowerCase().includes('aqueous matt finish') && !productData.name?.toLowerCase().includes('gold')) defaultShades = GOBIS_AQUEOUS_MATT_FINISH_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && productData.name?.toLowerCase().includes('gold') && productData.name?.toLowerCase().includes('aqueous matt finish')) defaultShades = GOBIS_GOLD_AQUEOUS_MATT_FINISH_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && productData.name?.toLowerCase().includes('gold') && productData.name?.toLowerCase().includes('eggshell') && productData.name?.toLowerCase().includes('matt finish')) defaultShades = GOBIS_GOLD_EGGSHELL_MATT_FINISH_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && productData.name?.toLowerCase().includes('gloss enamel') && !productData.name?.toLowerCase().includes('gold')) defaultShades = GOBIS_GLOSS_ENAMEL_SHADES;
                else if ((productData.brand === "Gobi's" || productData.brand === 'Gobis') && productData.name?.toLowerCase().includes('eggshell') && productData.name?.toLowerCase().includes('enamel') && !productData.name?.toLowerCase().includes('gold')) defaultShades = GOBIS_EGGSHELL_MATT_ENAMEL_SHADES;
                else if (productData.brand === 'Reliable' && (productData.name === 'Reliable Weather Protector' || productData.name === 'Reliable Ace Weather Defender')) defaultShades = RELIABLE_WEATHER_PROTECTOR_SHADES;
                else if (productData.brand === 'Reliable' && (productData.name === 'Reliable Matt Enamel' || productData.name === 'Reliable Matt Finish Inner')) defaultShades = RELIABLE_MATT_ENAMEL_SHADES;
                else if (productData.brand === 'Reliable' && productData.name === 'Reliable Emulsion') defaultShades = RELIABLE_EMULSION_SHADES;
                else if (productData.brand === 'Reliable' && productData.name?.toLowerCase().includes('water matt')) defaultShades = RELIABLE_WATER_MATT_SHADES;
                else if (productData.brand === 'Reliable' && productData.name?.toLowerCase().includes('enamel') && !productData.name?.toLowerCase().includes('matt')) defaultShades = RELIABLE_ENAMEL_SHADES;
                else if ((productData.brand === 'Choice' && productData.name?.toLowerCase().includes('synthetic enamel')) || productData.name?.toLowerCase().includes('choice synthetic enamel')) defaultShades = CHOICE_SYNTHETIC_ENAMEL_SHADES;
                else if (productData.brand === 'Choice' && productData.name?.toLowerCase().includes('weather sealer')) defaultShades = CHOICE_WEATHER_SEALER_SHADES;
                else if (productData.brand === 'Reliance' && productData.name?.toLowerCase().includes('stainless matt')) defaultShades = RELIANCE_STAINLESS_MATT_SHADES;
                else if (productData.brand === 'Reliance' && productData.name?.toLowerCase().includes('semi plastic emulsion')) defaultShades = RELIANCE_SEMI_PLASTIC_EMULSION_SHADES;
                else if (productData.brand === 'Reliance' && productData.name?.toLowerCase().includes('matt enamel')) defaultShades = RELIANCE_MATT_ENAMEL_SHADES;
                else if (productData.brand === 'Reliance' && productData.name?.toLowerCase().includes('weather guard')) defaultShades = RELIANCE_WEATHER_GUARD_SHADES;
                else if (productData.brand === 'Reliance' && productData.name?.toLowerCase().includes('synthetic enamel')) defaultShades = RELIANCE_SYNTHETIC_ENAMEL_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('weather pro')) defaultShades = BERGER_WEATHER_PRO_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('nu enamel')) defaultShades = BERGER_NU_ENAMEL_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('nu emulsion')) defaultShades = BERGER_NU_EMULSION_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('elegance silk emulsion')) defaultShades = BERGER_ELEGANCE_SILK_EMULSION_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('elegance matt emulsion')) defaultShades = BERGER_ELEGANCE_MATT_EMULSION_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('superior matt finish')) defaultShades = BERGER_SUPERIOR_MATT_FINISH_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('weather coat glow 365')) defaultShades = BERGER_WEATHER_COAT_GLOW_365_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('vip weather coat')) defaultShades = BERGER_VIP_WEATHER_COAT_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('allrounder matt enamel')) defaultShades = BERGER_ALLROUNDER_MATT_ENAMEL_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('top super emulsion')) defaultShades = BERGER_TOP_SUPER_EMULSION_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('super gloss enamel')) defaultShades = BERGER_SUPER_GLOSS_ENAMEL_SHADES;
                else if (productData.brand === 'Berger' && productData.name?.toLowerCase().includes('semi plastic emulsion')) defaultShades = BERGER_SEMI_PLASTIC_EMULSION_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('ace weather defender')) defaultShades = DIAMOND_ACE_WEATHER_DEFENDER_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('overall plasticcoat emulsion')) defaultShades = DIAMOND_OVERALL_PLASTICCOAT_EMULSION_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('ace acrylic plastic emulsion')) defaultShades = DIAMOND_ACE_ACRYLIC_PLASTIC_EMULSION_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('ace matt enamel')) defaultShades = DIAMOND_ACE_MATT_ENAMEL_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('ace super gloss enamel')) defaultShades = DIAMOND_ACE_SUPER_GLOSS_ENAMEL_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('overall super emulsion')) defaultShades = DIAMOND_OVERALL_SUPER_EMULSION_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('overall high gloss enamel')) defaultShades = DIAMOND_OVERALL_HIGH_GLOSS_ENAMEL_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('overall weather max')) defaultShades = DIAMOND_OVERALL_WEATHER_MAX_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('everlast high gloss enamel')) defaultShades = DIAMOND_EVERLAST_HIGH_GLOSS_ENAMEL_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('ace durasilk emulsion')) defaultShades = DIAMOND_ACE_DURASILK_EMULSION_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('value emulsion')) defaultShades = DIAMOND_VALUE_EMULSION_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('overall matt enamel')) defaultShades = DIAMOND_OVERALL_MATT_ENAMEL_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('aquamax')) defaultShades = DIAMOND_OVERALL_AQUAMAX_WATER_MATT_SHADES;
                else if (productData.brand === 'Diamond' && productData.name?.toLowerCase().includes('timberlac wood stain')) defaultShades = DIAMOND_ACE_TIMBERLAC_WOOD_STAINS_SHADES;

                // Fetch shades from DB, fallback to local constants
                const { data: shadeData } = await supabase
                    .from('product_shades')
                    .select('*')
                    .eq('product_id', id)
                    .order('name');

                if (shadeData && shadeData.length > 0) {
                    setShades(shadeData);
                } else {
                    setShades(defaultShades);
                }

                // Set default selected size
                if (productData.units && productData.units.length > 0) {
                    setSelectedSize(productData.units[0].label);
                }
            }
            setLoading(false);
        };

        if (id) fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            trackProductView(product);
        }
    }, [product]);

    const selectedUnit = useMemo(() => {
        return product?.units?.find(u => u.label === selectedSize) || product?.units?.[0];
    }, [product, selectedSize]);

    const price = selectedUnit?.price || 0;

    const handleAddToCart = () => {
        if (!product) return;
        setAddingToCart(true);
        addItem(
            product.id, 
            selectedSize, 
            quantity, 
            product,
            selectedShade ? {
                name: selectedShade.name,
                code: selectedShade.code,
                hex: selectedShade.hex
            } : undefined
        );
        setTimeout(() => setAddingToCart(false), 500);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) return <div className="min-h-screen pt-32 text-center text-gray-500">Product not found.</div>;

    return (
        <div className="min-h-screen pt-[70px] bg-white">
            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-100 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-navy">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 overflow-hidden">
                        <Link href="/" className="hover:text-gold uppercase tracking-tighter">Home</Link>
                        <ArrowRight size={10} className="shrink-0" />
                        <Link href={`/category/${product.category}`} className="hover:text-gold uppercase tracking-tighter truncate">{product.category}</Link>
                        <ArrowRight size={10} className="shrink-0" />
                        <span className="text-navy uppercase tracking-tighter font-bold truncate">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* LEFT COLUMN: Visualizer & Calculator Tabs */}
                    <div className="space-y-6 lg:sticky lg:top-[120px]">
                        {/* Tab Switcher */}
                        {!isDiamondAceTimberlacWoodStains && (
                            <div className="flex flex-wrap xs:flex-nowrap bg-gray-100 p-1 rounded-xl xs:rounded-2xl w-full xs:w-fit gap-1 xs:gap-0">
                                <button
                                    onClick={() => setActiveTab('visualizer')}
                                    className={`flex-1 xs:flex-none px-3 xs:px-6 py-2 rounded-lg xs:rounded-xl text-[10px] xs:text-xs font-bold transition-all ${activeTab === 'visualizer'
                                        ? 'bg-white text-navy shadow-sm'
                                        : 'text-gray-500 hover:text-navy'
                                        }`}
                                >
                                    Visualizer
                                </button>
                                <button
                                    onClick={() => setActiveTab('calculator')}
                                    className={`flex-1 xs:flex-none px-3 xs:px-6 py-2 rounded-lg xs:rounded-xl text-[10px] xs:text-xs font-bold transition-all ${activeTab === 'calculator'
                                        ? 'bg-white text-navy shadow-sm'
                                        : 'text-gray-500 hover:text-navy'
                                        }`}
                                >
                                    Calculator
                                </button>
                            </div>
                        )}

                        <div className="relative group rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100 min-h-[400px]">
                            {isDiamondAceTimberlacWoodStains ? (
                                <div className="aspect-square xs:aspect-[16/9] flex items-center justify-center p-4 xs:p-8">
                                    <img 
                                        src={product.image_url || ''} 
                                        className="max-h-[85%] xs:max-h-full object-contain transform scale-125 xs:scale-100 transition-transform duration-500" 
                                        alt={product.name}
                                    />
                                </div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    {activeTab === 'visualizer' ? (
                                        <motion.div
                                            key="visualizer"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                            className="h-full"
                                        >
                                            {hasShadeCard ? (
                                                <SimpleVisualizer
                                                    color={selectedShade?.hex || '#FFFFFF'}
                                                    name={selectedShade?.name || 'Standard'}
                                                    onSelect={(s) => setSelectedShade(s)}
                                                />
                                            ) : (
                                                <div className="aspect-square xs:aspect-[16/9] flex items-center justify-center p-4 xs:p-8 h-full w-full">
                                                    <img 
                                                        src={product.image_url || ''} 
                                                        alt={`${product.brand} ${product.name} product image`} 
                                                        className="max-h-[85%] xs:max-h-full object-contain transform scale-125 xs:scale-100 transition-transform duration-500" 
                                                    />
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="calculator"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                            className="p-4"
                                        >
                                            <PaintCalculator compact={true} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {!isDiamondAceTimberlacWoodStains && (
                            <div className="flex gap-4">
                                <div className="w-24 h-24 rounded-2xl border-2 border-gold p-2 bg-white flex items-center justify-center shadow-md">
                                    <img src={product.image_url || ''} alt={`${product.brand} logo or product icon`} className="w-full h-full object-contain" />
                                </div>
                                {selectedShade && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="w-24 h-24 rounded-2xl border-2 border-gray-100 overflow-hidden shadow-md"
                                    >
                                        <div className="w-full h-full" style={{ backgroundColor: selectedShade.hex }} />
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Details & Controls */}
                    <div className="space-y-10">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-navy text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    {product.brand}
                                </span>
                                <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none border border-gold/20">
                                    {product.category}
                                </span>
                                <div className={cn(
                                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                    product.in_stock 
                                        ? "bg-green-50 text-green-600 border-green-100" 
                                        : "bg-red-50 text-red-600 border-red-100"
                                )}>
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        product.in_stock ? "bg-green-500 animate-pulse" : "bg-red-500"
                                    )} />
                                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                </div>
                            </div>
                            <h1 className="font-heading text-3xl xs:text-4xl lg:text-5xl font-bold text-navy leading-tight mb-4 tracking-tight">
                                {product.name}
                            </h1>
                            <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-xl">
                                {product.brand} {product.name.replace(product.brand, '').trim()} (color) : <span className="text-navy font-bold">{selectedShade?.name || 'Select a shade'}</span>
                            </p>
                            {shadeCardPdf && (
                                <a
                                    href={shadeCardPdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 group inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-gold/20 text-gold rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-navy hover:border-gold transition-all duration-300 shadow-sm hover:shadow-gold/20"
                                >
                                    <FileText size={16} className="group-hover:scale-110 transition-transform" />
                                    <span>Download Shade Card PDF</span>
                                    <Download size={14} className="opacity-50 group-hover:translate-y-0.5 transition-transform" />
                                </a>
                            )}
                        </div>

                        {/* Color Selector (Grid) */}
                        {hasShadeCard && (
                            <ShadeSelector
                                shades={shades}
                                selectedSize={selectedSize}
                                onSelect={(s) => setSelectedShade(s)}
                            />
                        )}

                        {/* Size Selection */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Select Unit</label>
                            <div className="flex flex-wrap gap-3">
                                {product.units && product.units.map((unit, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSize(unit.label)}
                                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all border-2 ${selectedSize === unit.label
                                            ? 'bg-navy border-navy text-white shadow-xl shadow-navy/20'
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                            }`}
                                    >
                                        {unit.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price & POS */}
                        <div className="space-y-8 pt-4">
                            <div className="flex items-baseline gap-4">
                                <div className="text-2xl xs:text-4xl font-bold text-navy">Rs. {price?.toLocaleString()}</div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                                <div className="flex items-center justify-between sm:justify-start border-2 border-gray-100 rounded-xl bg-gray-50 p-1 w-full sm:w-auto h-14">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center text-navy font-bold hover:bg-white rounded-lg transition-colors">-</button>
                                    <span className="w-10 text-center font-bold text-navy">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center text-navy font-bold hover:bg-white rounded-lg transition-colors">+</button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || !product.in_stock}
                                    className="w-full sm:flex-1 h-14 bg-navy text-white font-bold rounded-xl shadow-xl shadow-navy/20 hover:bg-gold hover:shadow-gold/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    <ShoppingCart size={20} />
                                    {addingToCart ? 'Success!' : product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>

                            <Link
                                href={`https://wa.me/923475658761?text=Hi! I want to order ${product.name} (${selectedSize}) with shade ${selectedShade?.name || 'Standard'}.`}
                                target="_blank"
                                className="flex items-center gap-2 text-green-500 font-bold hover:underline"
                            >
                                <MessageCircle size={18} />
                                Chat with Us on WhatsApp
                            </Link>
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-10 border-t border-gray-100">
                            {[
                                { icon: ShieldCheck, label: '100% Original' },
                                { icon: Truck, label: 'Standard Delivery' },
                                { icon: Package, label: 'Secure Packing' }
                            ].map((b, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 text-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                    <b.icon size={20} className="text-navy" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-navy">{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <RecentlyViewed />
            </div>
        </div>
    );
}
