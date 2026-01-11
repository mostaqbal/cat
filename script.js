/***********************
 * GLOBAL STATE
 ***********************/
let isAdmin = false;

/***********************
 * LOGIN
 ***********************/
function login() {
  const inputPass = document.getElementById("adminPassword").value.trim();

  if (!inputPass) {
    alert("من فضلك أدخل كلمة المرور");
    return;
  }

  db.ref("admin/password").once("value")
    .then(snapshot => {
      const realPassword = snapshot.val();

      if (inputPass === realPassword) {
        isAdmin = true;

        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        document.getElementById("welcomeMsg").style.display = "block";
      } else {
        alert("كلمة المرور غير صحيحة");
      }
    })
    .catch(err => {
      console.error(err);
      alert("خطأ في الاتصال بقاعدة البيانات");
    });
}

/***********************
 * CHANGE PASSWORD
 ***********************/
function changePassword() {
  if (!isAdmin) return;

  const newPass = prompt("أدخل كلمة المرور الجديدة:");
  if (!newPass || newPass.length < 4) {
    alert("كلمة المرور قصيرة");
    return;
  }

  db.ref("admin/password").set(newPass)
    .then(() => alert("تم تغيير كلمة المرور"))
    .catch(() => alert("فشل التغيير"));
}

/***********************
 * ADD PROFILE
 ***********************/
function addProfile() {
  if (!isAdmin) return;

  const gender = document.getElementById("gender").value;

  const profile = {
    name: name.value.trim(),
    age: age.value.trim(),
    height: height.value.trim(),
    hair: hair.value.trim(),
    eyes: eyes.value.trim(),
    job: job.value.trim(),
    describeMe: describeMe.value.trim(),
    requirements: requirements.value.trim(),
    createdAt: Date.now()
  };

  if (!profile.name || !profile.age) {
    alert("الاسم والعمر مطلوبان");
    return;
  }

  db.ref("profiles/" + gender).push(profile)
    .then(clearForm)
    .catch(() => alert("خطأ في الحفظ"));
}

/***********************
 * LOAD PROFILES
 ***********************/
function loadProfiles() {
  db.ref("profiles/men").on("value", snap => {
    renderProfiles(snap.val(), "men");
  });

  db.ref("profiles/women").on("value", snap => {
    renderProfiles(snap.val(), "women");
  });
}

/***********************
 * RENDER
 ***********************/
function renderProfiles(data, gender) {
  const container = document.getElementById(
    gender === "men" ? "menList" : "womenList"
  );

  let html = `<h2>${gender === "men" ? "👨 الرجال" : "👩 النساء"}</h2>`;
  let index = 1;

  if (data) {
    for (let key in data) {
      html += `
        <div class="profile">
          <strong style="color:blue">${index++}. ${data[key].name}</strong><br>
          <span style="color:red">
            العمر: ${data[key].age} |
            الطول: ${data[key].height || "-"} |
            لون العيون: ${data[key].eyes || "-"}
          </span><br>
          الوظيفة: ${data[key].job || "-"}
        </div>
      `;
    }
  }

  container.innerHTML = html;
}

/***********************
 * UTIL
 ***********************/
function clearForm() {
  document.querySelectorAll("#adminPanel input, #adminPanel textarea")
    .forEach(el => el.value = "");
}

/***********************
 * INIT
 ***********************/
document.addEventListener("DOMContentLoaded", loadProfiles);
