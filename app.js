//declaring the required variables
const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs = document.querySelectorAll(".input-field");
const plans = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");
let time;
let currentStep = 1;
let currentCircle = 0;
const obj = {
  plan: null,
  kind: null,
  price: null,
};

//take the each step div with forEach() method
steps.forEach((step) => {
  const nextBtn = step.querySelector(".next-stp");
  const prevBtn = step.querySelector(".prev-stp");
  //prevBtn click event and make display none or flex stepdiv with currentStep variable
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      document.querySelector(`.step-${currentStep}`).style.display = "none";
      currentStep--;
      document.querySelector(`.step-${currentStep}`).style.display = "flex";
      circleSteps[currentCircle].classList.remove("active");
      currentCircle--;
    });
  }
  //nextBtn click event and make display none or flex stepdiv with currentStep variable
  nextBtn.addEventListener("click", () => {
    document.querySelector(`.step-${currentStep}`).style.display = "none";
    if (currentStep < 5 && validateFrom()) {
      currentStep++;
      currentCircle++;
      setTotal();
      console.log(currentCircle);
    }
    document.querySelector(`.step-${currentStep}`).style.display = "flex";
    circleSteps[currentCircle].classList.add("active");
    summery(obj);
  });
});

//summery function
function summery(obj) {
  const planName = document.querySelector(".plan-name");
  const planPrice = document.querySelector(".plan-price");
  planPrice.textContent = `${obj.price}`;
  planName.textContent = `${obj.plan} (${obj.kind ? "Monthly" : "Yearly"})`;
}

//making the validationForm functionality
function validateFrom() {
  let valid = true;
  for (let index = 0; index < formInputs.length; index++) {
    if (!formInputs[index].value) {
      valid = false;
      formInputs[index].classList.add("err");
      findLabel(formInputs[index]).nextElementSibling.style.display = "flex";
    } else {
      valid = true;
      formInputs[index].classList.remove("err");
      formInputs[index].classList.add("valid");
      findLabel(formInputs[index]).nextElementSibling.style.display = "none";
    }
  }
  return valid;
}
// finding the appropriate label according to the input id
function findLabel(el) {
  const idVal = el.id;
  const labels = document.getElementsByTagName("label");
  for (let index = 0; index < labels.length; index++) {
    if (labels[index].htmlFor == idVal) return labels[index];
  }
}

//taking the each plan element with forEach method and add click event
plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    document.querySelector(".selected").classList.remove("selected");
    plan.classList.add("selected");
    const planName = plan.querySelector("b").textContent;
    const planPrice = plan.querySelector(".plan-priced").textContent;
    obj.plan = planName;
    obj.price = planPrice;
  });
});

//adding the click event then add and remove "sw-active" class in the switch input
switcher.addEventListener("click", () => {
  const switchVal = switcher.querySelector(".switch-btn").checked;
  if (switchVal) {
    document.querySelector(".monthly").classList.remove("sw-active");
    document.querySelector(".yearly").classList.add("sw-active");
  } else {
    document.querySelector(".monthly").classList.add("sw-active");
    document.querySelector(".yearly").classList.remove("sw-active");
  }
  switchPrice(switchVal);
  obj.kind = switchVal;
});

addons.forEach((addon) => {
  addon.addEventListener("click", (e) => {
    const addonSelect = addon.querySelector("input");
    const ID = addon.getAttribute("data-id");
    console.log(addonSelect.checked);
    if (addonSelect.checked) {
      addonSelect.checked = false;
      addon.classList.remove("ad-selected");
      showAddon(ID, false);
    } else {
      addonSelect.checked = true;
      addon.classList.add("ad-selected");
      showAddon(addon, true);
      e.preventDefault();
    }
  });
});

//changing the plan card prices according to checked boolean value
function switchPrice(checked) {
  const yearlyPrice = [90, 120, 50];
  const monthlyPrice = [9, 12, 5];
  const prices = document.querySelectorAll(".plan-priced");
  if (checked) {
    prices[0].textContent = `$${yearlyPrice[0]}/yr`;
    prices[1].textContent = `$${yearlyPrice[1]}/yr`;
    prices[2].textContent = `$${yearlyPrice[2]}/yr`;
    setValid(true);
  } else {
    prices[0].textContent = `$${monthlyPrice[0]}/mo`;
    prices[1].textContent = `$${monthlyPrice[1]}/mo`;
    prices[2].textContent = `$${monthlyPrice[2]}/mo`;
    setValid(false);
  }
}

//showing the clicked plan card
function showAddon(ad, val) {
  const temp = document.getElementsByTagName("template")[0];
  const clone = temp.content.cloneNode(true);
  const serviceName = clone.querySelector(".service-name");
  const servicePrice = clone.querySelector(".service-price");
  const serviceID = clone.querySelector(".selected-addon");
  if (ad && val) {
    serviceName.textContent = ad.querySelector("label").textContent;
    servicePrice.textContent = ad.querySelector(".price").textContent;
    serviceID.setAttribute("data-id", ad.dataset.id);
    document.querySelector(".addons").appendChild(clone);
  } else {
    const addons = document.querySelectorAll(".selected-addon");
    addons.forEach((addon) => {
      const attr = addon.getAttribute("data-id");
      if (attr == ad) {
        addon.remove();
      }
    });
  }
}

//total price calculation
function setTotal() {
  const str = planPrice.textContent;
  const res = str.replace(/\D/g, "");
  const addonPrices = document.querySelectorAll(
    ".selected-addon .service-price"
  );
  let val = 0;
  for (let index = 0; index < addonPrices.length; index++) {
    const str = addonPrices[index].textContent;
    const res = str.replace(/\D/g, "");
    val += Number(res);
  }
  total.innerHTML = `$${val + Number(res)}/${time ? "yr" : "mo"}`;
}

function setValid(t) {
  return (time = t);
}
