import { jsPDF } from 'jspdf';
import { FitUser } from '../types/fitness';

export function downloadFitnessPlanPdf(user: FitUser) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 40;

  function checkPageBreak(requiredSpace: number) {
    if (cursorY + requiredSpace > pageHeight - 40) {
      doc.addPage();
      cursorY = 40;
      // Header on subsequent pages
      doc.setFontSize(8);
      doc.setTextColor(140, 150, 160);
      doc.text(`FitBuddy-AI Plan • ${user.name} • ${user.goal}`, margin, 25);
      doc.setDrawColor(220, 225, 230);
      doc.line(margin, 28, pageWidth - margin, 28);
    }
  }

  // Brand Header
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(margin, cursorY, contentWidth, 54, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FitBuddy-AI', margin + 16, cursorY + 28);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('AI-Powered Personalized Fitness & Nutrition Plan', margin + 16, cursorY + 44);

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date(user.created_at).toLocaleDateString()}`, pageWidth - margin - 16, cursorY + 36, {
    align: 'right',
  });

  cursorY += 70;

  // Profile Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, contentWidth, 68, 6, 6, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Athlete Profile: ${user.name}`, margin + 14, cursorY + 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  const col1 = `Age: ${user.age} yrs   |   Gender: ${user.gender}   |   Height: ${user.height} cm   |   Weight: ${user.weight} kg`;
  const col2 = `Fitness Goal: ${user.goal}   |   Activity Level: ${user.activity}`;
  const col3 = `Workout: ${user.workout_preference || 'Standard'}   |   Diet: ${user.dietary_preference || 'Balanced'}   |   Time: ${user.available_time || '30-45 mins'}`;

  doc.text(col1, margin + 14, cursorY + 36);
  doc.text(col2, margin + 14, cursorY + 48);
  doc.text(col3, margin + 14, cursorY + 60);

  cursorY += 84;

  const plan = user.plan;

  // Section 1: Summary
  checkPageBreak(80);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text('1. Personalized Overview', margin, cursorY);
  cursorY += 16;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(plan.summary || 'Custom tailored fitness regime designed for your specific goal.', contentWidth);
  doc.text(summaryLines, margin, cursorY);
  cursorY += summaryLines.length * 13 + 15;

  // Section 2: Workout Plan
  checkPageBreak(120);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text(`2. Workout Routine (${plan.workout_plan?.recommended_frequency || '3-4 days/week'})`, margin, cursorY);
  cursorY += 16;

  const phases = [
    { title: 'A. Warm-Up', data: plan.workout_plan?.warm_up },
    { title: 'B. Main Workout', data: plan.workout_plan?.main_workout },
    { title: 'C. Cool-Down', data: plan.workout_plan?.cool_down },
  ];

  phases.forEach((phase) => {
    if (!phase.data) return;
    checkPageBreak(50);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(phase.title, margin, cursorY);
    cursorY += 14;

    if (phase.data.description) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 116, 139);
      doc.text(phase.data.description, margin, cursorY);
      cursorY += 13;
    }

    if (phase.data.exercises && phase.data.exercises.length > 0) {
      phase.data.exercises.forEach((ex) => {
        checkPageBreak(25);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        const exText = `• ${ex.name}`;
        doc.text(exText, margin + 8, cursorY);

        const details = [ex.sets ? `${ex.sets} sets` : '', ex.reps ? `${ex.reps} reps` : '', ex.duration ? `${ex.duration}` : '', ex.notes ? `(${ex.notes})` : '']
          .filter(Boolean)
          .join(' • ');

        if (details) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 116, 139);
          doc.text(`  - ${details}`, margin + 14, cursorY + 11);
          cursorY += 21;
        } else {
          cursorY += 14;
        }
      });
    }
    cursorY += 8;
  });

  // Section 3: Nutrition
  checkPageBreak(120);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text('3. Nutrition Guidance', margin, cursorY);
  cursorY += 16;

  if (plan.nutrition_guidance?.general_advice) {
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const nutLines = doc.splitTextToSize(plan.nutrition_guidance.general_advice, contentWidth);
    doc.text(nutLines, margin, cursorY);
    cursorY += nutLines.length * 13 + 8;
  }

  if (plan.nutrition_guidance?.hydration) {
    checkPageBreak(25);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Hydration Goal: `, margin, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(plan.nutrition_guidance.hydration, margin + 85, cursorY);
    cursorY += 16;
  }

  if (plan.nutrition_guidance?.meal_suggestions?.length) {
    checkPageBreak(60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Sample Daily Meals:', margin, cursorY);
    cursorY += 14;

    plan.nutrition_guidance.meal_suggestions.forEach((meal) => {
      checkPageBreak(25);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text(`${meal.meal}:`, margin + 8, cursorY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const mealItems = meal.suggestions.join(', ');
      const wrappedMeal = doc.splitTextToSize(mealItems, contentWidth - 80);
      doc.text(wrappedMeal, margin + 75, cursorY);
      cursorY += wrappedMeal.length * 12 + 4;
    });
    cursorY += 8;
  }

  // Section 4: Weekly Schedule
  if (plan.weekly_schedule?.length) {
    checkPageBreak(120);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text('4. Weekly Schedule Breakdown', margin, cursorY);
    cursorY += 16;

    plan.weekly_schedule.forEach((day) => {
      checkPageBreak(20);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(`${day.day}:`, margin + 6, cursorY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const desc = `${day.focus} — ${day.activity} (${day.duration})`;
      doc.text(desc, margin + 80, cursorY);
      cursorY += 14;
    });
    cursorY += 10;
  }

  // Section 5: Fitness Tips & Tracking
  if (plan.fitness_tips?.length || plan.progress_tracking?.length) {
    checkPageBreak(90);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text('5. Coaching Tips & Progress Milestones', margin, cursorY);
    cursorY += 16;

    if (plan.fitness_tips?.length) {
      plan.fitness_tips.forEach((tip) => {
        checkPageBreak(20);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const tipLines = doc.splitTextToSize(`✓ ${tip}`, contentWidth - 10);
        doc.text(tipLines, margin + 6, cursorY);
        cursorY += tipLines.length * 12 + 3;
      });
      cursorY += 6;
    }

    if (plan.progress_tracking?.length) {
      checkPageBreak(30);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text('How to Track Progress:', margin + 6, cursorY);
      cursorY += 14;

      plan.progress_tracking.forEach((metric) => {
        checkPageBreak(20);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const mLines = doc.splitTextToSize(`• ${metric}`, contentWidth - 16);
        doc.text(mLines, margin + 12, cursorY);
        cursorY += mLines.length * 12 + 3;
      });
      cursorY += 8;
    }
  }

  // Disclaimer Box
  checkPageBreak(50);
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.roundedRect(margin, cursorY, contentWidth, 38, 4, 4, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14);
  doc.text('DISCLAIMER: NOT MEDICAL ADVICE', margin + 10, cursorY + 13);

  doc.setFont('helvetica', 'normal');
  const disclaimer = 'This AI-generated plan is for general fitness and educational purposes only. It is not medical advice. Consult a qualified healthcare professional before starting a new exercise or nutrition program, especially if you have a medical condition.';
  const discLines = doc.splitTextToSize(disclaimer, contentWidth - 20);
  doc.text(discLines, margin + 10, cursorY + 23);

  // Save the PDF
  const sanitizedName = user.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  doc.save(`FitBuddy_${sanitizedName}_plan.pdf`);
}
