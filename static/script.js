// i18n translations
const translations = {
  en: {
    title: "🎵 Sonify",
    subtitle: "AI Voice Generator • Powered by Gemini TTS • 30 Voice Options",
    speakerLabel: "Number of Speakers:",
    speaker: "Speaker",
    speakers: "Speakers",
    custom: "Custom",
    customPlaceholder: "Enter number (1-30)",
    apply: "Apply",
    scriptLabel: "Conversation Text / Script:",
    generateBtn: "🎵 Generate Audio",
    audioGenerated: "🎵 Audio Generated!",
    downloadBtn: "⬇️ Download Audio",
    tipsTitle: "💡 Usage Tips:",
    tip1: "<strong>1 speaker:</strong> Write text directly without speaker label, or use <code class='bg-gray-200 px-1 rounded'>Speaker 1:</code>",
    tip2: "<strong>Multiple speakers:</strong> Use format <code class='bg-gray-200 px-1 rounded'>Speaker 1:</code>, <code class='bg-gray-200 px-1 rounded'>Speaker 2:</code>, etc.",
    tip3: "<strong>Auto-detect:</strong> System will randomly select voices from 30 voice options",
    tip4: "<strong>Multi-language:</strong> Supports Japanese, English, Mandarin, Indonesian, and more",
    errorEmpty: "Text cannot be empty",
    loadingText: "Generating Audio",
    customAlert: "Number of speakers must be between 1-30"
  },
  id: {
    title: "🎵 Sonify",
    subtitle: "Generator Suara AI • Bertenaga Gemini TTS • 30 Pilihan Suara",
    speakerLabel: "Jumlah Speaker:",
    speaker: "Speaker",
    speakers: "Speaker",
    custom: "Kustom",
    customPlaceholder: "Masukkan jumlah (1-30)",
    apply: "Terapkan",
    scriptLabel: "Teks Percakapan / Soal:",
    generateBtn: "🎵 Generate Audio",
    audioGenerated: "🎵 Audio Berhasil Dibuat!",
    downloadBtn: "⬇️ Unduh Audio",
    tipsTitle: "💡 Tips Penggunaan:",
    tip1: "<strong>1 speaker:</strong> Langsung tulis teks tanpa label speaker, atau gunakan <code class='bg-gray-200 px-1 rounded'>Speaker 1:</code>",
    tip2: "<strong>Multiple speakers:</strong> Gunakan format <code class='bg-gray-200 px-1 rounded'>Speaker 1:</code>, <code class='bg-gray-200 px-1 rounded'>Speaker 2:</code>, dst.",
    tip3: "<strong>Auto-detect:</strong> Sistem akan memilih voice secara random dari 30 voice options",
    tip4: "<strong>Multi-language:</strong> Mendukung Japanese, English, Mandarin, Indonesian, dan bahasa lainnya",
    errorEmpty: "Teks tidak boleh kosong",
    loadingText: "Membuat Audio",
    customAlert: "Jumlah speaker harus antara 1-30"
  },
  zh: {
    title: "🎵 Sonify",
    subtitle: "AI语音生成器 • 由Gemini TTS驱动 • 30种语音选项",
    speakerLabel: "说话人数量：",
    speaker: "说话人",
    speakers: "说话人",
    custom: "自定义",
    customPlaceholder: "输入数量 (1-30)",
    apply: "应用",
    scriptLabel: "对话文本 / 脚本：",
    generateBtn: "🎵 生成音频",
    audioGenerated: "🎵 音频生成成功！",
    downloadBtn: "⬇️ 下载音频",
    tipsTitle: "💡 使用提示：",
    tip1: "<strong>1个说话人：</strong>直接输入文本，无需标签，或使用 <code class='bg-gray-200 px-1 rounded'>Speaker 1:</code>",
    tip2: "<strong>多个说话人：</strong>使用格式 <code class='bg-gray-200 px-1 rounded'>Speaker 1:</code>、<code class='bg-gray-200 px-1 rounded'>Speaker 2:</code> 等",
    tip3: "<strong>自动检测：</strong>系统将从30种语音选项中随机选择语音",
    tip4: "<strong>多语言：</strong>支持日语、英语、中文、印尼语等多种语言",
    errorEmpty: "文本不能为空",
    loadingText: "正在生成音频",
    customAlert: "说话人数量必须在1-30之间"
  }
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Update text content - with null checks
  const h1 = document.querySelector('h1');
  if (h1) h1.innerHTML = t.title;

  const subtitle = document.querySelector('p.text-center.text-gray-600');
  if (subtitle) subtitle.textContent = t.subtitle;

  const speakerLabel = document.querySelector('label[for="num_speakers"]');
  if (speakerLabel) speakerLabel.textContent = t.speakerLabel;

  const scriptLabel = document.querySelector('label[for="script"]');
  if (scriptLabel) scriptLabel.textContent = t.scriptLabel;

  const generateBtn = document.querySelector('button[type="submit"]');
  if (generateBtn) generateBtn.innerHTML = t.generateBtn;

  const loadingText = document.querySelector('.loading-text');
  if (loadingText) loadingText.textContent = t.loadingText;

  // Update speaker buttons
  document.querySelectorAll('.speaker-btn[data-speakers]').forEach(btn => {
    const speakers = btn.getAttribute('data-speakers');
    if (speakers === 'custom') {
      btn.textContent = t.custom;
    } else if (speakers === '1') {
      btn.textContent = `1 ${t.speaker}`;
    } else {
      btn.textContent = `${speakers} ${t.speakers}`;
    }
  });

  // Update custom input placeholder
  const customInput = document.getElementById('customSpeakers');
  if (customInput) customInput.placeholder = t.customPlaceholder;

  const applyBtn = document.querySelector('#customInput button[type="button"]');
  if (applyBtn) applyBtn.textContent = t.apply;

  // Update tips
  const tipsTitle = document.querySelector('h3.text-indigo-600');
  if (tipsTitle) tipsTitle.innerHTML = t.tipsTitle;

  const tipsList = document.querySelectorAll('ul.list-none li');
  if (tipsList.length >= 4) {
    tipsList[0].innerHTML = t.tip1;
    tipsList[1].innerHTML = t.tip2;
    tipsList[2].innerHTML = t.tip3;
    tipsList[3].innerHTML = t.tip4;
  }

  // Update audio result if exists
  const audioResultTitle = document.querySelector('.bg-gradient-to-br h3');
  if (audioResultTitle) {
    audioResultTitle.innerHTML = t.audioGenerated;
  }
  const downloadBtn = document.querySelector('a[download]');
  if (downloadBtn) {
    downloadBtn.innerHTML = t.downloadBtn;
  }

  // Save to localStorage
  localStorage.setItem('sonify_lang', lang);

  // Update active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
    btn.classList.add('bg-white/90', 'text-indigo-600', 'border-transparent');
  });
  const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
  activeBtn.classList.remove('bg-white/90', 'text-indigo-600', 'border-transparent');
  activeBtn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
}

const speakerBtns = document.querySelectorAll('.speaker-btn[data-speakers]');
const customInputGroup = document.getElementById('customInput');
const numSpeakersInput = document.getElementById('num_speakers');
const scriptTextarea = document.getElementById('script');

function updateSpeakerTemplate(numSpeakers) {
  // Jangan overwrite kalau user sudah mulai ngetik
  if (scriptTextarea.value.trim() !== '' && !scriptTextarea.value.startsWith('Speaker')) {
    return;
  }

  if (numSpeakers === 1) {
    scriptTextarea.value = "Speaker 1: ";
    scriptTextarea.placeholder = "Tulis teks langsung tanpa label, atau gunakan Speaker 1:";
  } else {
    let template = '';
    for (let i = 1; i <= numSpeakers; i++) {
      template += `Speaker ${i}: \n\n`;
    }
    scriptTextarea.value = template.trim();
    scriptTextarea.placeholder = `Isi dialog untuk ${numSpeakers} speakers`;
  }

  // Auto focus ke textarea
  scriptTextarea.focus();
  // Set cursor di akhir text
  scriptTextarea.setSelectionRange(scriptTextarea.value.length, scriptTextarea.value.length);
}

speakerBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    speakerBtns.forEach(b => {
      b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
      b.classList.add('bg-white', 'border-gray-300');
    });
    this.classList.remove('bg-white', 'border-gray-300');
    this.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');

    const speakers = this.getAttribute('data-speakers');

    if (speakers === 'custom') {
      customInputGroup.classList.remove('hidden');
      customInputGroup.classList.add('flex');
    } else {
      customInputGroup.classList.add('hidden');
      customInputGroup.classList.remove('flex');
      numSpeakersInput.value = speakers;
      updateSpeakerTemplate(parseInt(speakers));
    }
  });
});

function applyCustomSpeakers() {
  const customValue = parseInt(document.getElementById('customSpeakers').value);
  if (customValue >= 1 && customValue <= 30) {
    numSpeakersInput.value = customValue;
    updateSpeakerTemplate(customValue);
  } else {
    alert(translations[currentLang].customAlert);
  }
}

function detectSpeakersFromText() {
  const text = scriptTextarea.value;
  const speakerMatches = text.match(/Speaker\s+(\d+):/g);

  if (!speakerMatches || speakerMatches.length === 0) {
    return;
  }

  // Cari speaker number tertinggi
  const speakerNumbers = speakerMatches.map(match => {
    const num = match.match(/\d+/);
    return num ? parseInt(num[0]) : 0;
  });
  const maxSpeaker = Math.max(...speakerNumbers);

  // Update hidden input
  numSpeakersInput.value = maxSpeaker;

  // Update active button
  speakerBtns.forEach(btn => {
    const btnValue = btn.getAttribute('data-speakers');
    if (btnValue === maxSpeaker.toString()) {
      speakerBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
        b.classList.add('bg-white', 'border-gray-300');
      });
      btn.classList.remove('bg-white', 'border-gray-300');
      btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
      customInputGroup.classList.add('hidden');
      customInputGroup.classList.remove('flex');
    } else if (btnValue === 'custom' && maxSpeaker > 4) {
      speakerBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
        b.classList.add('bg-white', 'border-gray-300');
      });
      btn.classList.remove('bg-white', 'border-gray-300');
      btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
      customInputGroup.classList.remove('hidden');
      customInputGroup.classList.add('flex');
      document.getElementById('customSpeakers').value = maxSpeaker;
    }
  });
}

// Listen to textarea changes
scriptTextarea.addEventListener('input', detectSpeakersFromText);
scriptTextarea.addEventListener('paste', () => {
  setTimeout(detectSpeakersFromText, 100);
});

// Initialize
// Load saved language or default to English
const savedLang = localStorage.getItem('sonify_lang') || 'en';
setLanguage(savedLang);
updateSpeakerTemplate(1);

// Loading animation on form submit
const form = document.getElementById('audioForm');
const loadingOverlay = document.getElementById('loadingOverlay');
const generateBtn = document.querySelector('button[type="submit"]');

form.addEventListener('submit', function(e) {
  // Show loading overlay
  loadingOverlay.classList.remove('hidden');
  loadingOverlay.classList.add('flex');
  generateBtn.disabled = true;
});
