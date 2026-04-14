import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6sL6Ssv8Go0B-gCseNRV9X1qgyO8br6s",
  authDomain: "zeeshan-electric.firebaseapp.com",
  projectId: "zeeshan-electric",
  storageBucket: "zeeshan-electric.firebasestorage.app",
  messagingSenderId: "1096626194064",
  appId: "1:1096626194064:web:7b085332941be9f4513a15",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase Connected ✅");

// ─────────────────────────────

const btn = document.querySelector('.ze-submit-btn');
const check = document.getElementById('ze-submit-check');

function showToast() {
  const toast = document.getElementById('ze-toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

btn.removeAttribute('for');

// ✅ MAKE FUNCTION ASYNC
btn.addEventListener('click', async () => {

  const name    = document.getElementById('ze-name').value.trim();
  const phone   = document.getElementById('ze-phone').value.trim();
  const address = document.getElementById('ze-address').value.trim();
  const service = document.getElementById('ze-service').value;

  const fields = [
    { id: 'ze-name', val: name, msg: 'Please enter your full name.' },
    { id: 'ze-phone', val: phone, msg: 'Please enter your phone number.' },
    { id: 'ze-address', val: address, msg: 'Please enter your address.' },
    { id: 'ze-service', val: service, msg: 'Please select a service type.' },
  ];

  clearErrors();

  let valid = true;

  fields.forEach(f => {
    if (!f.val) {
      showError(f.id, f.msg);
      valid = false;
    }
  });

  // Better phone validation
  if (phone && !/^[0-9]{10}$/.test(phone)) {
    showError('ze-phone', 'Enter a valid 10-digit phone number.');
    valid = false;
  }

  if (!valid) return;

  btn.innerText = "Booking...";
  btn.disabled = true;

  const desc = document.getElementById('ze-desc').value.trim();

  const bookingData = {
    customer: {
      name,
      phone,
      address
    },
    service: {
      type: service,
      label: document.getElementById('ze-service').selectedOptions[0].text,
      description: desc
    },
    status: "pending",
    meta: {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  };

  try {
  await addDoc(collection(db, "bookings"), bookingData);

  // ✅ success UI
  check.checked = true;
  showToast();

  // reset button text (optional since hidden)
  
  btn.disabled = true;
btn.innerText = "Booked ✅";

} catch (err) {
  console.error(err);

  alert("Something went wrong. Try again.");

  // ✅ restore button
  btn.innerText = "Book Service";
  btn.disabled = false;
}

});

// ─────────────────────────────

function showError(id, msg) {
  const wrap = document.getElementById(id).closest('.ze-input-wrap');
  const input = document.getElementById(id);

  input.style.borderColor = '#EF4444';
  input.style.boxShadow = '0 0 0 4px rgba(239,68,68,0.1)';

  const err = document.createElement('span');
  err.className = 'ze-error';
  err.textContent = msg;
  err.style.cssText = 'color:#EF4444;font-size:12px;margin-top:4px;display:block;';
  wrap.after(err);
}

function clearErrors() {
  document.querySelectorAll('.ze-error').forEach(e => e.remove());
  ['ze-name','ze-phone','ze-address','ze-service'].forEach(id => {
    const el = document.getElementById(id);
    el.style.borderColor = '';
    el.style.boxShadow = '';
  });
}

// Live clear error
['ze-name','ze-phone','ze-address','ze-service'].forEach(id => {
  document.getElementById(id).addEventListener('input', clearErrors);
  document.getElementById(id).addEventListener('change', clearErrors);
});

// Phone restriction
document.getElementById('ze-phone').addEventListener('keypress', e => {
  if (!/[0-9]/.test(e.key)) e.preventDefault();
});