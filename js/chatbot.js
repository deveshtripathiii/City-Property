// ============================================================
// CITY PROPERTY — AI Support Chatbot
// Smart conversational bot for property troubleshooting
// Records full chat and sends to WhatsApp
// ============================================================

const CHAT_PHONE = '919711733120';

// ── AI Brain: knowledge base + conversation flows ──
const AI_KNOWLEDGE = {
  greetings: ['hello','hi','hey','namaste','hii','helo','namaskar'],
  buyKeywords: ['buy','purchase','sale','sell','kharidna','khareedna','lena'],
  rentKeywords: ['rent','rental','kiraya','kira','lease','pg','hostel','room','flat'],
  landKeywords: ['plot','land','zameen','construction','build'],
  priceKeywords: ['price','cost','budget','kitna','rate','value'],
  locationKeywords: ['location','sector','gna','yea','greater noida','yamuna','where','kahan'],
  documentKeywords: ['document','registry','paper','deed','stamp','registration','noc'],
  loanKeywords: ['loan','finance','emi','bank','mortgage','home loan'],
  visitKeywords: ['visit','site visit','see','show','inspect','dekhna'],
  complaintKeywords: ['complaint','problem','issue','fraud','cheat','fake','scam','wrong'],
};

const BOT_FLOWS = {
  start: {
    message: "👋 Namaste! I'm **CityBot**, your AI assistant for City Property.\n\nHow can I help you today?",
    quick: ['🏠 Buy Property', '🔑 Rent Property', '🌿 Land / Plot', '📋 Documents Help', '🏦 Home Loan', '📍 Site Visit', '⚠️ Report Issue', '📞 Talk to Team']
  },
  buy: {
    message: "Great! I'll help you find a property to buy. 🏠\n\nWhat type of property are you looking for?",
    quick: ['Flat / Apartment', 'Builder Floor', 'Commercial Building', 'Plot / Land', 'House / Villa']
  },
  rent: {
    message: "Looking for a rental? Perfect! 🔑\n\nWhat type of accommodation do you need?",
    quick: ['Flat / Apartment', 'Single Room', 'PG / Hostel', 'Commercial Space', 'Entire Building']
  },
  land: {
    message: "Interested in Land or Construction? 🌿\n\nWhich authority zone are you interested in?",
    quick: ['Greater Noida Authority (GNA)', 'Yamuna Expressway Authority (YEA)', 'Both / Not Sure']
  },
  budget: {
    message: "What is your approximate budget?",
    quick: ['Under ₹10 Lakh', '₹10–25 Lakh', '₹25–50 Lakh', '₹50L–1 Crore', 'Above ₹1 Crore', 'Not decided yet']
  },
  location_q: {
    message: "Which sector or area in Greater Noida are you interested in?",
    quick: ['Sector Alpha / Beta / Gamma', 'Knowledge Park (1/2/3/4)', 'Sector Omega / MU / PI', 'Yamuna Expressway Sectors', 'Not sure — suggest me']
  },
  bedroom: {
    message: "How many bedrooms do you need?",
    quick: ['1 BHK', '2 BHK', '3 BHK', '4 BHK+', 'Studio / 1 Room', 'No bedroom (Commercial)']
  },
  timeline: {
    message: "When are you planning to move in / complete the deal?",
    quick: ['Immediately', 'Within 1 month', '1–3 months', '3–6 months', 'Just exploring']
  },
  document: {
    message: "📋 Document & Legal Help\n\nWhat kind of document help do you need?",
    quick: ['Registry / Sale Deed', 'NOC from Authority', 'GNA Lease Deed', 'YEA Allotment Letter', 'Home Loan Papers', 'Other Documents']
  },
  loan: {
    message: "🏦 Home Loan Assistance\n\nWe help with home loans at the best rates!\n\nWhat do you need help with?",
    quick: ['Check my eligibility', 'Compare bank rates', 'Apply for loan', 'Loan for plot/land', 'Refinance existing loan']
  },
  visit: {
    message: "📍 Site Visit\n\nWe'll arrange a FREE site visit for you!\n\nWhich type of property do you want to visit?",
    quick: ['Residential Flat', 'Plot / Land', 'Commercial Property', 'Hostel / PG', 'Multiple Properties']
  },
  complaint: {
    message: "⚠️ I'm sorry to hear you're facing an issue. We take all complaints seriously.\n\nPlease tell me more about your problem:",
    quick: ['Wrong property info shown', 'Payment / Booking issue', 'Registry / Document problem', 'Fraud / Cheating complaint', 'Site visit not arranged', 'Other issue']
  },
  contact: {
    message: "📞 Our team is ready to help!\n\nChoose how you'd like to connect:",
    quick: ['📱 Call Now — 97117 33120', '💬 WhatsApp Chat', '🕐 Schedule a Callback']
  },
  name: { message: "May I know your **name** please?" },
  phone: { message: "Please share your **10-digit mobile number** so our team can contact you:" },
  done: { message: "✅ Thank you! I've recorded all your details.\n\nI'll send your query to our team via WhatsApp right now. They'll contact you shortly!" }
};

// ── State ──
let chatState = {
  step: 'start',
  history: [],        // [{role, text, time}]
  userData: {},       // collected data
  issueRecord: {},    // full issue/query record
  isOpen: false,
  isTyping: false
};

// ── Smart AI Response Engine ──
function getAIResponse(userInput) {
  const input = userInput.toLowerCase().trim();
  const issue = chatState.issueRecord;

  // Detect intent from free text
  if (chatState.step === 'awaiting_name') {
    chatState.userData.name = userInput;
    issue.name = userInput;
    chatState.step = 'awaiting_phone';
    return { text: `Nice to meet you, **${userInput}**! 😊\n\n` + BOT_FLOWS.phone.message };
  }

  if (chatState.step === 'awaiting_phone') {
    const digits = userInput.replace(/\D/g, '');
    if (digits.length < 10) {
      return { text: "⚠️ Please enter a valid 10-digit mobile number." };
    }
    chatState.userData.phone = digits;
    issue.phone = digits;
    issue.customerId = 'CID-' + digits.substring(0, 5);
    chatState.step = 'awaiting_message';
    return {
      text: `📱 Got it!\n\n**Your Customer ID:** \`${issue.customerId}\`\n\nAnything specific you'd like to add or ask? (or type "done" to submit)`,
      showCID: true,
      cid: issue.customerId
    };
  }

  if (chatState.step === 'awaiting_message') {
    if (input !== 'done' && input !== 'send' && input !== 'submit') {
      issue.extraMessage = userInput;
    }
    chatState.step = 'submitting';
    return { text: BOT_FLOWS.done.message, action: 'send_whatsapp' };
  }

  // Quick reply / keyword matching
  if (AI_KNOWLEDGE.greetings.some(g => input.includes(g))) {
    chatState.step = 'start';
    return { text: BOT_FLOWS.start.message, quick: BOT_FLOWS.start.quick };
  }
  if (input.includes('buy') || input.includes('purchase') || input.includes('sale')) {
    chatState.step = 'buy_type';
    issue.intent = 'Buy Property';
    return { text: BOT_FLOWS.buy.message, quick: BOT_FLOWS.buy.quick };
  }
  if (input.includes('rent') || input.includes('room') || input.includes('pg') || input.includes('hostel')) {
    chatState.step = 'rent_type';
    issue.intent = 'Rent Property';
    return { text: BOT_FLOWS.rent.message, quick: BOT_FLOWS.rent.quick };
  }
  if (input.includes('plot') || input.includes('land') || input.includes('construction')) {
    chatState.step = 'land_auth';
    issue.intent = 'Land / Construction';
    return { text: BOT_FLOWS.land.message, quick: BOT_FLOWS.land.quick };
  }
  if (input.includes('document') || input.includes('registry') || input.includes('paper') || input.includes('deed')) {
    chatState.step = 'doc_type';
    issue.intent = 'Document Help';
    return { text: BOT_FLOWS.document.message, quick: BOT_FLOWS.document.quick };
  }
  if (input.includes('loan') || input.includes('finance') || input.includes('emi')) {
    chatState.step = 'loan_type';
    issue.intent = 'Home Loan';
    return { text: BOT_FLOWS.loan.message, quick: BOT_FLOWS.loan.quick };
  }
  if (input.includes('visit') || input.includes('site') || input.includes('see')) {
    chatState.step = 'visit_type';
    issue.intent = 'Site Visit';
    return { text: BOT_FLOWS.visit.message, quick: BOT_FLOWS.visit.quick };
  }
  if (input.includes('complaint') || input.includes('problem') || input.includes('issue') || input.includes('fraud')) {
    chatState.step = 'complaint_type';
    issue.intent = 'Complaint / Issue';
    return { text: BOT_FLOWS.complaint.message, quick: BOT_FLOWS.complaint.quick };
  }
  if (input.includes('call') || input.includes('talk') || input.includes('contact') || input.includes('team')) {
    return { text: BOT_FLOWS.contact.message, quick: BOT_FLOWS.contact.quick };
  }
  if (input.includes('97117') || input.includes('call now')) {
    window.location.href = 'tel:9711733120';
    return { text: "📞 Connecting you now... If it doesn't open, dial **97117 33120**" };
  }
  if (input.includes('whatsapp')) {
    return { text: "Great! Let me collect your details first to personalise your WhatsApp message.", quick: ['Proceed ➜'] };
  }

  // Flow-based state handlers
  switch(chatState.step) {
    case 'buy_type':
    case 'rent_type':
      issue.propertyType = userInput;
      chatState.step = 'budget_q';
      return { text: BOT_FLOWS.budget.message, quick: BOT_FLOWS.budget.quick };

    case 'land_auth':
      issue.authority = userInput;
      chatState.step = 'budget_q';
      return { text: BOT_FLOWS.budget.message, quick: BOT_FLOWS.budget.quick };

    case 'budget_q':
      issue.budget = userInput;
      chatState.step = 'location_q';
      return { text: BOT_FLOWS.location_q.message, quick: BOT_FLOWS.location_q.quick };

    case 'location_q':
      issue.preferredLocation = userInput;
      if (issue.intent && (issue.intent.includes('Rent') || issue.intent.includes('Buy'))) {
        chatState.step = 'bedroom_q';
        return { text: BOT_FLOWS.bedroom.message, quick: BOT_FLOWS.bedroom.quick };
      }
      chatState.step = 'timeline_q';
      return { text: BOT_FLOWS.timeline.message, quick: BOT_FLOWS.timeline.quick };

    case 'bedroom_q':
      issue.bedrooms = userInput;
      chatState.step = 'timeline_q';
      return { text: BOT_FLOWS.timeline.message, quick: BOT_FLOWS.timeline.quick };

    case 'timeline_q':
    case 'doc_type':
    case 'loan_type':
    case 'visit_type':
    case 'complaint_type':
      issue.detail = (issue.detail || '') + userInput + '; ';
      chatState.step = 'awaiting_name';
      return { text: "📝 Almost done! Let me connect you with our team.\n\n" + BOT_FLOWS.name.message };
  }

  // Default fallback
  return {
    text: "I didn't quite catch that. Let me show you what I can help with:",
    quick: BOT_FLOWS.start.quick
  };
}

// ── Handle Quick Reply Click ──
function handleQuickReply(text) {
  if (!chatState.isOpen) return;
  addMessage('user', text);
  processInput(text);
}

// ── Process Input ──
function processInput(text) {
  showTyping();
  const delay = 800 + Math.random() * 600;
  setTimeout(() => {
    hideTyping();
    const response = getAIResponse(text);
    addMessage('bot', response.text, response.quick, response.showCID ? response.cid : null);
    if (response.action === 'send_whatsapp') {
      setTimeout(() => sendChatToWhatsApp(), 1500);
    }
  }, delay);
}

// ── Add Message to UI ──
function addMessage(role, text, quickReplies, cid) {
  const log = { role, text, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
  chatState.history.push(log);

  const chatBody = document.getElementById('chatBody');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${role}`;

  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code style="background:#e0f2fe;padding:2px 6px;border-radius:4px;font-size:0.85em;">$1</code>')
    .replace(/\n/g, '<br>');

  msgDiv.innerHTML = `
    <div class="chat-bubble">
      ${role === 'bot' ? '<div class="bot-avatar"><i class="fas fa-robot"></i></div>' : ''}
      <div class="bubble-content">
        <div class="bubble-text">${formattedText}</div>
        ${cid ? `<div class="cid-badge"><i class="fas fa-id-badge"></i> Customer ID: <strong>${cid}</strong></div>` : ''}
        <div class="bubble-time">${log.time}</div>
      </div>
    </div>
    ${quickReplies ? `<div class="quick-replies">${quickReplies.map(q => `<button class="qr-btn" onclick="handleQuickReply('${q.replace(/'/g,"\\'")}'); this.parentElement.querySelectorAll('.qr-btn').forEach(b=>b.classList.add('disabled'))">${q}</button>`).join('')}</div>` : ''}
  `;
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ── Typing Indicator ──
function showTyping() {
  const chatBody = document.getElementById('chatBody');
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot typing-indicator-wrap';
  typing.id = 'typingIndicator';
  typing.innerHTML = `
    <div class="chat-bubble">
      <div class="bot-avatar"><i class="fas fa-robot"></i></div>
      <div class="bubble-content">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    </div>`;
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function hideTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

// ── Send chat summary to WhatsApp ──
function sendChatToWhatsApp() {
  const issue = chatState.issueRecord;
  const userData = chatState.userData;
  let msg = `🏠 *City Property — Support Query*\n`;
  msg += `━━━━━━━━━━━━━━━━━━\n`;
  if (issue.customerId) msg += `🆔 *Customer ID:* ${issue.customerId}\n`;
  if (userData.name)   msg += `👤 *Name:* ${userData.name}\n`;
  if (userData.phone)  msg += `📱 *Phone:* ${userData.phone}\n`;
  msg += `━━━━━━━━━━━━━━━━━━\n`;
  if (issue.intent)           msg += `📋 *Query Type:* ${issue.intent}\n`;
  if (issue.propertyType)     msg += `🏗️ *Property Type:* ${issue.propertyType}\n`;
  if (issue.authority)        msg += `🏛️ *Authority:* ${issue.authority}\n`;
  if (issue.budget)           msg += `💰 *Budget:* ${issue.budget}\n`;
  if (issue.preferredLocation)msg += `📍 *Location Preference:* ${issue.preferredLocation}\n`;
  if (issue.bedrooms)         msg += `🛏️ *Bedrooms:* ${issue.bedrooms}\n`;
  if (issue.detail)           msg += `📝 *Details:* ${issue.detail}\n`;
  if (issue.extraMessage)     msg += `💬 *Message:* ${issue.extraMessage}\n`;
  msg += `━━━━━━━━━━━━━━━━━━\n`;
  msg += `⏰ *Time:* ${new Date().toLocaleString('en-IN')}\n`;
  msg += `🌐 *Source:* City Property Website Chatbot`;

  const url = `https://wa.me/${CHAT_PHONE}?text=${encodeURIComponent(msg)}`;
  setTimeout(() => {
    window.open(url, '_blank');
    addMessage('bot', `✅ Your query has been sent to our team on WhatsApp!\n\nOur team will call you back soon. Thank you for contacting **City Property** 🏠`, ['🔄 Start New Chat', '📞 Call Now']);
  }, 500);
}

// ── Toggle Chat ──
function toggleChat() {
  const panel = document.getElementById('chatPanel');
  const bubble = document.getElementById('chatBubble');
  chatState.isOpen = !chatState.isOpen;

  if (chatState.isOpen) {
    panel.classList.add('open');
    bubble.classList.add('active');
    if (chatState.history.length === 0) {
      setTimeout(() => {
        addMessage('bot', BOT_FLOWS.start.message, BOT_FLOWS.start.quick);
      }, 300);
    }
    setTimeout(() => document.getElementById('chatInput').focus(), 400);
  } else {
    panel.classList.remove('open');
    bubble.classList.remove('active');
  }
}

// ── Send user message ──
function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addMessage('user', text);
  if (chatState.step === 'submitting' || text.toLowerCase() === 'start new chat' || text.toLowerCase() === '🔄 start new chat') {
    resetChat();
    return;
  }
  if (text.includes('📞 Call Now') || text.toLowerCase() === '📞 call now') {
    window.location.href = 'tel:9711733120';
    return;
  }
  processInput(text);
}

// ── Reset Chat ──
function resetChat() {
  chatState = { step: 'start', history: [], userData: {}, issueRecord: {}, isOpen: true, isTyping: false };
  document.getElementById('chatBody').innerHTML = '';
  setTimeout(() => addMessage('bot', BOT_FLOWS.start.message, BOT_FLOWS.start.quick), 300);
}

// ── Inject Chat Widget HTML ──
function injectChatWidget() {
  const widget = document.createElement('div');
  widget.innerHTML = `
    <!-- Chat Bubble Button -->
    <div id="chatBubble" onclick="toggleChat()" title="AI Support Chat" style="
      position:fixed; bottom:90px; right:20px; z-index:9000;
      width:58px; height:58px; border-radius:50%;
      background:linear-gradient(135deg,#1a3c6e,#2554a0);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; box-shadow:0 4px 20px rgba(26,60,110,0.4);
      transition:all 0.3s; border:3px solid #fff;
    ">
      <i class="fas fa-robot" style="color:#fff; font-size:1.4rem;"></i>
      <div id="chatNotifBadge" style="
        position:absolute; top:-4px; right:-4px;
        width:20px; height:20px; background:#f5a623; border-radius:50%;
        display:flex; align-items:center; justify-content:center;
        font-size:0.65rem; font-weight:800; color:#fff; border:2px solid #fff;
        animation: pulseBadge 2s infinite;
      ">AI</div>
    </div>

    <!-- Chat Panel -->
    <div id="chatPanel" style="
      position:fixed; bottom:160px; right:20px; z-index:8999;
      width:340px; max-height:520px;
      background:#fff; border-radius:20px;
      box-shadow:0 20px 60px rgba(0,0,0,0.2);
      display:flex; flex-direction:column; overflow:hidden;
      transform:scale(0.8) translateY(20px); opacity:0;
      pointer-events:none; transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    ">
      <!-- Header -->
      <div style="
        background:linear-gradient(135deg,#1a3c6e,#2554a0);
        padding:14px 16px; display:flex; align-items:center; gap:10px;
        flex-shrink:0;
      ">
        <div style="
          width:38px; height:38px; border-radius:50%;
          background:rgba(255,255,255,0.2);
          display:flex; align-items:center; justify-content:center;
          font-size:1.1rem; color:#fff; position:relative;
        ">
          <i class="fas fa-robot"></i>
          <div style="position:absolute;bottom:1px;right:1px;width:10px;height:10px;background:#27ae60;border-radius:50%;border:2px solid #1a3c6e;"></div>
        </div>
        <div style="flex:1;">
          <div style="font-weight:700; color:#fff; font-size:0.9rem;">CityBot — AI Assistant</div>
          <div style="font-size:0.7rem; color:rgba(255,255,255,0.7);">🟢 Online · City Property Support</div>
        </div>
        <button onclick="toggleChat()" style="
          background:rgba(255,255,255,0.15); border:none; border-radius:8px;
          width:30px; height:30px; color:#fff; cursor:pointer; font-size:1rem;
          display:flex;align-items:center;justify-content:center;
        "><i class="fas fa-times"></i></button>
      </div>

      <!-- Body -->
      <div id="chatBody" style="
        flex:1; overflow-y:auto; padding:14px;
        background:#f8fafc;
        display:flex; flex-direction:column; gap:12px;
        max-height:360px;
      "></div>

      <!-- Input -->
      <div style="
        padding:10px 12px; border-top:1px solid #e0e6ef;
        display:flex; gap:8px; align-items:center; flex-shrink:0;
        background:#fff;
      ">
        <input id="chatInput" type="text" placeholder="Type your message..."
          onkeydown="if(event.key==='Enter')sendChatMessage()"
          style="
            flex:1; padding:10px 14px; border:1.5px solid #e0e6ef;
            border-radius:50px; font-size:0.85rem; outline:none;
            font-family:inherit; transition:border-color 0.2s;
          "
          onfocus="this.style.borderColor='#1a3c6e'"
          onblur="this.style.borderColor='#e0e6ef'"
        />
        <button onclick="sendChatMessage()" style="
          width:38px; height:38px; border-radius:50%;
          background:linear-gradient(135deg,#1a3c6e,#2554a0);
          color:#fff; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          font-size:0.95rem; flex-shrink:0;
          transition:transform 0.2s;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>

    <style>
      #chatPanel.open {
        transform: scale(1) translateY(0) !important;
        opacity: 1 !important;
        pointer-events: all !important;
      }
      #chatBubble.active { transform: scale(1.05); }
      @keyframes pulseBadge {
        0%,100%{transform:scale(1);} 50%{transform:scale(1.2);}
      }
      .chat-msg { display:flex; flex-direction:column; gap:6px; }
      .chat-msg.user { align-items:flex-end; }
      .chat-msg.bot  { align-items:flex-start; }
      .chat-bubble { display:flex; gap:8px; align-items:flex-start; max-width:100%; }
      .chat-msg.user .chat-bubble { flex-direction:row-reverse; }
      .bot-avatar {
        width:28px; height:28px; border-radius:50%;
        background:linear-gradient(135deg,#1a3c6e,#2554a0);
        display:flex; align-items:center; justify-content:center;
        color:#fff; font-size:0.75rem; flex-shrink:0; margin-top:2px;
      }
      .bubble-content { display:flex; flex-direction:column; gap:3px; max-width:calc(100% - 40px); }
      .bubble-text {
        padding:10px 13px; border-radius:14px; font-size:0.82rem;
        line-height:1.5; word-break:break-word;
      }
      .chat-msg.bot  .bubble-text { background:#fff; color:#2d2d2d; border-radius:4px 14px 14px 14px; box-shadow:0 1px 4px rgba(0,0,0,0.08); }
      .chat-msg.user .bubble-text { background:linear-gradient(135deg,#1a3c6e,#2554a0); color:#fff; border-radius:14px 4px 14px 14px; }
      .bubble-time { font-size:0.65rem; color:#9ca3af; padding: 0 4px; }
      .chat-msg.user .bubble-time { text-align:right; }
      .cid-badge {
        background:linear-gradient(135deg,#e0f2fe,#bfdbfe);
        border:1px solid #93c5fd; border-radius:8px;
        padding:6px 10px; font-size:0.75rem; color:#1e40af;
        display:flex; align-items:center; gap:6px;
      }
      .quick-replies {
        display:flex; flex-wrap:wrap; gap:6px;
        padding: 2px 0 0 36px;
      }
      .qr-btn {
        padding:6px 12px; border-radius:50px;
        border:1.5px solid #1a3c6e; background:#fff;
        color:#1a3c6e; font-size:0.75rem; font-weight:600;
        cursor:pointer; transition:all 0.2s;
        font-family:inherit; white-space:nowrap;
      }
      .qr-btn:hover { background:#1a3c6e; color:#fff; }
      .qr-btn.disabled { opacity:0.4; pointer-events:none; }
      .typing-dots { display:flex; gap:4px; padding:10px 14px; }
      .typing-dots span {
        width:7px; height:7px; border-radius:50%;
        background:#1a3c6e; opacity:0.4;
        animation:typingDot 1.2s infinite;
      }
      .typing-dots span:nth-child(2){animation-delay:.2s;}
      .typing-dots span:nth-child(3){animation-delay:.4s;}
      @keyframes typingDot{0%,60%,100%{opacity:0.4;transform:translateY(0);}30%{opacity:1;transform:translateY(-4px);}}
      #chatBody::-webkit-scrollbar{width:4px;}
      #chatBody::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px;}

      /* Mobile chat */
      @media(max-width:480px){
        #chatPanel{
          width:calc(100vw - 24px) !important;
          right:12px !important;
          bottom:140px !important;
          max-height:60vh !important;
        }
        #chatBubble{ right:14px !important; bottom:82px !important; }
      }
    </style>
  `;
  document.body.appendChild(widget);
}

// ── Auto-init ──
document.addEventListener('DOMContentLoaded', () => {
  injectChatWidget();
  // Show chat notification after 4 seconds
  setTimeout(() => {
    const badge = document.getElementById('chatNotifBadge');
    if (badge) {
      badge.style.background = '#ef4444';
      badge.textContent = '1';
    }
  }, 4000);
});
