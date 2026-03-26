document.addEventListener('DOMContentLoaded', () => {
      // DOM Elements
                              const elements = {
                                        crm: document.getElementById('crm'),
                                        salesTeam: document.getElementById('salesTeam'),
                                        socialMedia: document.getElementById('socialMedia'),
                                        incomeGoal: document.getElementById('incomeGoal'),
                                        averageCheck: document.getElementById('averageCheck'),
                                        conversion: document.getElementById('conversion'),
                                        cplMin: document.getElementById('cplMin'),
                                        cplMax: document.getElementById('cplMax'),
                                        calculateBtn: document.getElementById('calculateBtn'),

                                        // Result elements
                                        riskMeter: document.getElementById('riskMeter'),
                                        riskLabel: document.getElementById('riskLabel'),
                                        riskDescription: document.getElementById('riskDescription'),
                                        resCustomers: document.getElementById('resCustomers'),
                                        resLeads: document.getElementById('resLeads'),
                                        resBudgetMin: document.getElementById('resBudgetMin'),
                                        resBudgetMax: document.getElementById('resBudgetMax'),
                                        totalPenalty: document.getElementById('totalPenalty'),
                                        recommendationList: document.getElementById('recommendationList')
                              };

                              const calculateAudit = () => {
                                        // Collect Inputs
                                        const data = {
                                                      crm: elements.crm.value,
                                                      salesTeam: elements.salesTeam.value,
                                                      socialMedia: elements.socialMedia.value,
                                                      incomeGoal: parseFloat(elements.incomeGoal.value) || 0,
                                                      averageCheck: parseFloat(elements.averageCheck.value) || 0,
                                                      conversion: parseFloat(elements.conversion.value) / 100 || 0,
                                                      cplMin: parseFloat(elements.cplMin.value) || 0,
                                                      cplMax: parseFloat(elements.cplMax.value) || 0
                                        };

                                        // 1. Calculate Core Metrics
                                        const customersNeeded = Math.ceil(data.incomeGoal / data.averageCheck);
                                        const leadsNeeded = Math.ceil(customersNeeded / data.conversion);

                                        // 2. Calculate Risks and Penalties
                                        let riskValue = 0;
                                        let crmPenalty = 0;
                                        let salesPenalty = 0;
                                        let riskLevel = "Past";
                                        let riskDesc = "Tizimingiz mustahkam holatda.";

                                        if (data.crm === 'no') {
                                                      riskValue += 40;
                                                      crmPenalty = 20;
                                        }
                                        if (data.salesTeam === 'no') {
                                                      riskValue += 40;
                                                      salesPenalty = 20;
                                        }

                                        if (data.socialMedia === 'bad') riskValue += 20;
                                        else if (data.socialMedia === 'good') riskValue += 10;

                                        riskValue = Math.min(riskValue, 100);

                                        if (riskValue >= 70) {
                                                      riskLevel = "Yuqori";
                                                      riskDesc = "Tizim yo'qligi sababli daromad yo'qotish ehtimoli juda yuqori.";
                                        } else if (riskValue >= 40) {
                                                      riskLevel = "O'rtacha";
                                                      riskDesc = "Tizimda kamchiliklar bor, samaradorlikni oshirish kerak.";
                                        }

                                        const totalPenalty = crmPenalty + salesPenalty;

                                        // 3. Calculate Ad Budget
                                        const budgetMin = Math.round(leadsNeeded * data.cplMin);
                                        const budgetMax = Math.round(leadsNeeded * data.cplMax);

                                        // 4. Page Transition
                                        document.getElementById('setupPage').classList.add('hidden');
                                        document.getElementById('setupPage').classList.remove('visible');

                                        const resultsPage = document.getElementById('resultsPage');
                                        resultsPage.classList.remove('hidden');
                                        resultsPage.classList.add('visible');

                                        // 5. Update UI
                                        updateUI(leadsNeeded, customersNeeded, budgetMin, budgetMax, riskValue, riskLevel, riskDesc, totalPenalty, crmPenalty, salesPenalty);
                                        generateRecommendations(data.crm, data.salesTeam, data.socialMedia, riskLevel);

                                        // Scroll to top of results
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                              };

                              // Back Button Functionality
                              document.getElementById('backBtn').addEventListener('click', () => {
                                        document.getElementById('resultsPage').classList.add('hidden');
                                        document.getElementById('resultsPage').classList.remove('visible');

                                                                                          const setupPage = document.getElementById('setupPage');
                                        setupPage.classList.remove('hidden');
                                        setupPage.classList.add('visible');

                                                                                          window.scrollTo({ top: 0, behavior: 'smooth' });
                              });

                              const updateUI = (leads, customers, bMin, bMax, riskVal, riskLbl, riskDsc, penalty, crmP, salesP) => {
                                        animateValue(elements.resCustomers, 0, customers, 800);
                                        animateValue(elements.resLeads, 0, leads, 800);

                                        elements.resBudgetMin.innerText = `$${bMin.toLocaleString()}`;
                                        elements.resBudgetMax.innerText = `$${bMax.toLocaleString()}`;

                                        elements.totalPenalty.innerText = `+${penalty}%`;
                                        document.getElementById('penaltyCRM').innerText = `+${crmP}%`;
                                        document.getElementById('penaltySales').innerText = `+${salesP}%`;

                                        elements.riskLabel.innerText = riskLbl;
                                        elements.riskDescription.innerText = riskDsc;

                                        elements.riskMeter.style.setProperty('--risk-percent', `${riskVal}%`);

                                        if (riskVal >= 70) elements.riskLabel.style.color = 'var(--danger)';
                                        else if (riskVal >= 40) elements.riskLabel.style.color = 'var(--accent)';
                                        else elements.riskLabel.style.color = 'var(--secondary)';
                              };

                              const animateValue = (obj, start, end, duration) => {
                                        if (start === end) {
                                                      obj.innerText = end.toLocaleString();
                                                      return;
                                        }
                                        let startTimestamp = null;
                                        const step = (timestamp) => {
                                                      if (!startTimestamp) startTimestamp = timestamp;
                                                      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                                                      obj.innerText = Math.floor(progress * (end - start) + start).toLocaleString();
                                                      if (progress < 1) window.requestAnimationFrame(step);
                                        };
                                        window.requestAnimationFrame(step);
                              };

                              const generateRecommendations = (crm, sales, social, risk) => {
                                        elements.recommendationList.innerHTML = '';
                                        const recs = [];

                                        // Critical System Recs
                                        if (crm === 'no') {
                                                      recs.push({[Rocket]',
                                                                                 text: "<b>CRM joriy etish:</b> Bitrix24 yoki AmoCRM orqali har bir mijozni nazoratga oling. Bu reklamadan keladigan yo'qotishlarni 20% ga kamaytiradi."
                                                                });
                                        }

                                        if (sales === 'no') {
                                                      recs.push({
                                                                        icon: '[Users]',
                                                                        text: "<b>Sotuv bo'limi:</b> Kamida 1 ta professional sotuv menejeri yollang. O'zingiz sotishdan tizimli sotuvga o'tish daromadni 2-3 baravar oshiradi."
                                                      });
                                        }

                                        if (social === 'bad') {
                                                      recs.push({
                                                                        icon: '[Palette]',
                                                                        text: "<b>Brending (Upakovka):</b> Instagram profilingizni vizual va ma'lumot jihatidan yangilang. 'Trust' (ishonch) faktori past bo'lsa, lid narxi qimmat bo'lib qoladi."
                                                      });
                                        }

                                        recs.push({
                                                      icon: '[Shield]',
                                                      text: `<b>Xavfsizlik:</b> Sizda hozir xavf darajasi ${risk}. Turg'unlikka erishish uchun biznes jarayonlarni avtomatlashtirish shart.`
                                        });

                                        recs.push({
                                                      icon: '[Chart]',
                                                      text: "<b>Test Byudjet:</b> Birinchi oyda $200-300 test byudjet bilan aniq lid narxini aniqlang, so'ngra masshtabni kengaytiring."
                                        });

                                        recs.forEach((rec, index) => {
                                                      const li = document.createElement('li');
                                                      li.style.animationDelay = `${index * 0.15}s`;
                                                      li.className = 'fade-in';
                                                      li.innerHTML = `<div class="rec-icon">${rec.icon}</div> <span>${rec.text}</span>`;
                                                      elements.recommendationList.appendChild(li);
                                        });
                              };

      elements.calculateBtn.addEventListener('click', calculateAudit);
});
                                                                        icon: '
