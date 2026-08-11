import React, { useState } from 'react';
import { MessageCircle, Save, Check, Sparkles, Send } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { formatWhatsAppTemplate, openWhatsApp } from '../../utils/whatsapp';
import { getBookingLink } from '../../utils/links';

export const WhatsAppTemplatesTab: React.FC = () => {
  const { whatsappTemplates, updateWhatsAppTemplate, studio } = useStudioStore();
  const [selectedTplId, setSelectedTplId] = useState(whatsappTemplates[0]?.id || '');
  const [templateText, setTemplateText] = useState(whatsappTemplates[0]?.template_text || '');
  const [testPhone, setTestPhone] = useState('5491155550199');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentTpl = whatsappTemplates.find((t) => t.id === selectedTplId) || whatsappTemplates[0];

  const handleSelectTemplate = (id: string) => {
    setSelectedTplId(id);
    const tpl = whatsappTemplates.find((t) => t.id === id);
    if (tpl) {
      setTemplateText(tpl.template_text);
    }
  };

  const handleSave = () => {
    updateWhatsAppTemplate(selectedTplId, templateText);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const sampleVariables = {
    nombre: 'Camila',
    estudio: studio.name,
    clase: 'Pilates Reformer',
    horario: '18:00',
    fecha: '10/08',
    sede: 'Sede Palermo',
    monto: '15.000',
    creditos: '5',
    link: getBookingLink(studio.slug),
  };

  const previewMessage = formatWhatsAppTemplate(templateText, sampleVariables);

  const handleTestWhatsApp = () => {
    openWhatsApp(testPhone, previewMessage);
  };

  return (
    <div className="space-y-6">
      
      {/* Templates Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {whatsappTemplates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => handleSelectTemplate(tpl.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              tpl.id === selectedTplId
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tpl.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Editor (Left Column) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">{currentTpl?.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Personaliza el mensaje que se enviará automáticamente a tus alumnos por WhatsApp
            </p>
          </div>

          {/* Tags Helper */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
              Variables disponibles (se reemplazarán automáticamente):
            </span>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono font-bold text-slate-700">
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 cursor-pointer" onClick={() => setTemplateText((prev) => prev + ' {{nombre}}')}>&#123;&#123;nombre&#125;&#125;</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 cursor-pointer" onClick={() => setTemplateText((prev) => prev + ' {{clase}}')}>&#123;&#123;clase&#125;&#125;</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 cursor-pointer" onClick={() => setTemplateText((prev) => prev + ' {{horario}}')}>&#123;&#123;horario&#125;&#125;</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 cursor-pointer" onClick={() => setTemplateText((prev) => prev + ' {{fecha}}')}>&#123;&#123;fecha&#125;&#125;</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 cursor-pointer" onClick={() => setTemplateText((prev) => prev + ' {{sede}}')}>&#123;&#123;sede&#125;&#125;</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 cursor-pointer" onClick={() => setTemplateText((prev) => prev + ' {{link}}')}>&#123;&#123;link&#125;&#125;</span>
            </div>
          </div>

          <div>
            <textarea
              rows={6}
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center space-x-1.5"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? '¡Guardado!' : 'Guardar Plantilla'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Preview Mockup (Right Column) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#efeae2] to-[#e6dfd5] rounded-3xl p-5 border border-slate-200 shadow-soft">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-3">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Vista Previa en WhatsApp:</span>
          </div>

          {/* Chat Bubble */}
          <div className="bg-white rounded-2xl rounded-tl-xs p-4 shadow-sm text-xs text-slate-800 leading-relaxed relative">
            <p className="whitespace-pre-wrap">{previewMessage}</p>
            <span className="text-[9px] text-slate-400 font-semibold block text-right mt-2">
              16:45 • Entregado
            </span>
          </div>

          {/* Test Link Button */}
          <div className="mt-4 pt-4 border-t border-slate-300/60 space-y-2">
            <label className="block text-[11px] font-bold text-slate-700">
              Probar envío a tu propio WhatsApp:
            </label>
            <div className="flex space-x-2">
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                placeholder="54911..."
              />
              <button
                onClick={handleTestWhatsApp}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Abrir</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
