/**
 * Hamilton United 2010 Boys (U17 OPDL) - Player form + Parent form, 2026/27.
 *
 * HOW TO RUN (2 minutes):
 *  1. Go to https://script.google.com and click "New project".
 *  2. Delete the sample code, paste this whole file, click Save.
 *  3. Pick "createAll" in the function menu and click Run.
 *  4. Approve the permissions (it only creates Forms and Sheets in your Drive).
 *  5. Open "Execution log": it prints the share link and edit link for each form.
 *
 * BEFORE RUNNING: upload HU2010B_2027_Showcase_Plan.jpg to your Google Drive (any folder).
 *  The parent form shows it above the 2027 question. If it is missing, the form still builds
 *  and the log tells you.
 *
 * Each form gets its own response spreadsheet. Running it again makes new copies.
 * Edit any question afterwards in the normal Google Forms editor.
 */

var TEAM = 'Hamilton United 2010 Boys · U17 OPDL';
var SHOWCASE_IMAGE = 'HU2010B_2027_Showcase_Plan.jpg';
var POSITIONS = ['Goalkeeper', 'Centre back', 'Full back / wing back', 'Defensive midfield',
  'Central midfield', 'Attacking midfield', 'Winger', 'Striker'];

function createAll() {
  var p = buildForm_(TEAM + ' · Player Form 2026/27',
    'For players only. Answer honestly: this helps the coaching staff plan your development. ' +
    'Only the coaching staff sees your answers.', PLAYER_FORM);
  var g = buildForm_(TEAM + ' · Parent / Guardian Form 2026/27',
    'One form per player, filled in by a parent or guardian. Contact, emergency and consent ' +
    'details are seen only by the coach and team manager.', PARENT_FORM);
  [p, g].forEach(function (r) {
    Logger.log('%s\n  Share link: %s\n  Edit link:  %s\n  Responses:  %s',
      r.title, r.share, r.edit, r.sheet);
  });
}

// ---------- PLAYER FORM ----------
var PLAYER_FORM = [
  ['page', 'About you'],
  ['text', 'Full name', true],
  ['date', 'Date of birth', true],
  ['text', 'Mobile number (for the WhatsApp player chat)', true],
  ['choice', 'Dominant foot', true, ['Right', 'Left', 'Both']],

  ['page', 'Your game'],
  ['list', 'Position you think you would best help the team', true, POSITIONS],
  ['list', 'Another position you think you would best help the team', false, POSITIONS],
  ['para', 'Your 3 biggest strengths as a player', true],
  ['para', 'The 2 things you most want to improve this year', true],

  ['page', 'Goals and pathway'],
  ['para', 'Your main goal for this season', true],
  ['text', 'One word you want this team (your team) to be known for this year', true],
  ['choice', 'Are you interested in playing university or college soccer?', true,
    ['Yes, Canada', 'Yes, USA', 'Yes, either', 'Not sure yet', 'No']],
  ['choice', 'Which 2027 event path excites you most?', false,
    ['Option 1: Local showcase path', 'Option 2: USA showcase (Dallas Cup)',
     'Option 3: Hybrid (Ontario + Jefferson Cup)', 'No preference']],

  ['page', 'Availability and wellbeing'],
  ['para', 'Other sports, school teams or commitments this year (and when)', false],
  ['checkbox', 'Indoor sessions you can usually make', true,
    ['Sun 9:30-11:00 AM (Dome)', 'Mon 9:00-10:30 PM (Dome)',
     'Wed 7:30-9:00 PM (Gym)', 'Sat 10:00-11:30 AM (Gym)']],
  ['para', 'Any current injury or anything physical the coach should know about?', false],
  ['para', 'Anything else you want the coach to know?', false]
];

// ---------- PARENT FORM ----------
var PARENT_FORM = [
  ['page', 'Player and family contacts'],
  ['text', 'Player full name', true],
  ['text', 'Parent / guardian 1: name', true],
  ['text', 'Parent / guardian 1: mobile (for the WhatsApp parent chat)', true],
  ['text', 'Parent / guardian 1: email', true],

  ['page', 'Medical'],
  ['para', 'Allergies, medical conditions or medication staff should know about', false],
  ['para', 'Concussion or major injury in the last 2 years (with dates)', false],

  ['page', '2027 showcase and tournament plan'],
  ['image', '2027 Showcase & Tournament Plan: three options', SHOWCASE_IMAGE],
  ['choice', 'Which path do you prefer for 2027? (see the plan above)', true,
    ['Option 1: Local showcase path', 'Option 2: USA showcase (Dallas Cup, Mar 21-28)',
     'Option 3: Hybrid (2 Ontario events + Jefferson Cup)', 'No preference']],
  ['choice', 'If we go to the U.S., which travel model works for your family?', true,
    ['Players + staff only', 'Players + parents / families', 'Either works',
     'We would find U.S. travel difficult']],
  ['checkbox', 'What matters most to your family when we choose? (pick up to 2)', false,
    ['Competition level', 'Player development', 'University exposure', 'Total cost',
     'Family / travel commitment']],

  ['page', 'Volunteering and fundraising'],
  ['checkbox', 'Can you help with any of these?', false,
    ['Fundraising committee: Chair', 'Fundraising committee: Treasurer',
     'Fundraising committee: Events', 'Fundraising committee: Sponsorship',
     'Team manager support', 'Social coordinator', 'Game-day filming (Veo)',
     'First-aid trained parent']],
  ['para', 'Do you have any business or contacts that could sponsor the team? (optional)', false],
  ['para', 'Fundraising ideas you would back (optional)', false],

  ['page', 'Anything else'],
  ['para', 'Anything about your son the coach should know (school load, wellbeing, goals)?', false],
  ['para', 'Questions for the coaching staff', false]
];

// ---------- builder ----------
function buildForm_(title, description, items) {
  var form = FormApp.create(title)
    .setDescription(description)
    .setCollectEmail(true)
    .setProgressBar(true)
    .setConfirmationMessage('Thanks! The coaching staff will be in touch through WhatsApp.');
  var first = true;
  items.forEach(function (q) {
    var kind = q[0], t = q[1], req = q[2], item;
    switch (kind) {
      case 'image':
        var files = DriveApp.getFilesByName(q[2]);
        if (files.hasNext()) {
          form.addImageItem().setTitle(t).setImage(files.next().getBlob())
            .setAlignment(FormApp.Alignment.CENTER);
        } else {
          Logger.log('Image "%s" not found in Drive: upload it and add it in the form editor.', q[2]);
        }
        return;
      case 'page':
        if (first) { form.addSectionHeaderItem().setTitle(t); first = false; }
        else form.addPageBreakItem().setTitle(t);
        return;
      case 'text': item = form.addTextItem(); break;
      case 'para': item = form.addParagraphTextItem(); break;
      case 'date': item = form.addDateItem(); break;
      case 'choice': item = form.addMultipleChoiceItem().setChoiceValues(q[3]); break;
      case 'checkbox': item = form.addCheckboxItem().setChoiceValues(q[3]); break;
      case 'list': item = form.addListItem().setChoiceValues(q[3]); break;
      case 'scale':
        item = form.addScaleItem().setBounds(q[3], q[4]).setLabels(q[5], q[6]); break;
    }
    item.setTitle(t).setRequired(!!req);
  });
  var ss = SpreadsheetApp.create(title + ' (Responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  return { title: title, share: form.getPublishedUrl(), edit: form.getEditUrl(), sheet: ss.getUrl() };
}
