/** Priority assigned to a mock condition, used to craft the answer. */
export type TriageLevel = 'emergency' | 'urgent' | 'routine' | 'selfCare';

/** Prebaked content for matching demo inputs to suggested guidance. */
export type ConditionResponse = {
	title: string;
	keywords: string[];
	triage: TriageLevel;
	recommendedSetting: 'Emergency Room' | 'Urgent Care' | 'Primary Care' | 'Self-care';
	guidance: string;
	redFlags?: string[];
	selfCareTips?: string[];
};

/** Common mock responses for student/demo use; not medical advice. */
export const conditionResponses: ConditionResponse[] = [
	{
		title: 'Chest pain or pressure',
		keywords: ['chest pain', 'pressure', 'tightness', 'radiating arm', 'jaw pain'],
		triage: 'emergency',
		recommendedSetting: 'Emergency Room',
		guidance:
			'Call 911 and go to the ER. Chest pain with pressure, shortness of breath, sweating, or pain radiating to arm/jaw may be a heart attack.',
		redFlags: [
			'Shortness of breath',
			'Sweating or nausea',
			'Pain radiating to arm, jaw, or back',
			'History of heart disease',
		],
	},
	{
		title: 'Stroke symptoms',
		keywords: ['stroke', 'weakness', 'numbness', 'slurred speech', 'face droop'],
		triage: 'emergency',
		recommendedSetting: 'Emergency Room',
		guidance:
			'Call 911 and go to the ER. Sudden weakness, facial droop, speech trouble, or vision loss can be stroke signs and need immediate care.',
		redFlags: ['Sudden onset', 'Vision changes', 'Severe headache', 'Balance loss'],
	},
	{
		title: 'Severe abdominal pain',
		keywords: ['severe abdominal pain', 'stomach pain severe', 'rigid abdomen'],
		triage: 'emergency',
		recommendedSetting: 'Emergency Room',
		guidance:
			'Go to the ER. Severe abdominal pain, especially with fever, vomiting, or a rigid abdomen, needs urgent evaluation.',
		redFlags: ['Fever', 'Vomiting blood', 'Black or bloody stool', 'Pregnancy'],
	},
	{
		title: 'Shortness of breath',
		keywords: ['shortness of breath', 'trouble breathing', 'wheezing severe'],
		triage: 'emergency',
		recommendedSetting: 'Emergency Room',
		guidance:
			'Go to the ER. Severe or sudden trouble breathing can be asthma flare, allergic reaction, or heart/lung emergency.',
		redFlags: ['Blue lips', 'Cannot speak full sentences', 'Chest pain', 'History of asthma or COPD'],
	},
	{
		title: 'High fever',
		keywords: ['fever', 'high fever', '103 fever', '104 fever'],
		triage: 'urgent',
		recommendedSetting: 'Urgent Care',
		guidance:
			'For fever above 103°F (39.4°C) or lasting >3 days, go to urgent care. Infants under 3 months with any fever should go to ER.',
		selfCareTips: ['Hydrate well', 'Use acetaminophen/ibuprofen if appropriate', 'Rest'],
	},
	{
		title: 'Headache / migraine',
		keywords: ['migraine', 'headache'],
		triage: 'routine',
		recommendedSetting: 'Primary Care',
		guidance:
			'Schedule primary care for recurrent migraines or headaches. If sudden “worst headache of life,” vision changes, or neuro symptoms, go to the ER.',
		redFlags: ['Thunderclap onset', 'Vision changes', 'Weakness or numbness', 'Fever with stiff neck'],
		selfCareTips: ['Hydrate', 'Limit screen time', 'Rest in a dark room'],
	},
	{
		title: 'Minor injury or sprain',
		keywords: ['sprain', 'minor injury', 'twisted ankle', 'mild pain'],
		triage: 'selfCare',
		recommendedSetting: 'Self-care',
		guidance:
			'For mild sprains with no deformity or inability to bear weight, start RICE (rest, ice, compression, elevation) and monitor. If swelling/deformity or cannot bear weight, urgent care.',
		selfCareTips: ['Rest and elevate', 'Ice 15-20 min every 2-3 hours', 'Compression wrap if available'],
	},
	{
		title: 'Cuts or lacerations',
		keywords: ['cut', 'laceration', 'bleeding'],
		triage: 'urgent',
		recommendedSetting: 'Urgent Care',
		guidance:
			'If bleeding won’t stop after 10 minutes of pressure, the wound is deep, or you see muscle/fat, go to urgent care. Call 911 if severe or pulsatile bleeding.',
		selfCareTips: ['Apply direct pressure', 'Clean with mild soap/water if minor', 'Keep covered'],
	},
	{
		title: 'Rash',
		keywords: ['rash', 'hives'],
		triage: 'routine',
		recommendedSetting: 'Primary Care',
		guidance:
			'Mild rashes can be seen in primary care. If rash comes with trouble breathing, facial swelling, or lip/tongue swelling, call 911 (possible anaphylaxis).',
		selfCareTips: ['Avoid new products', 'Use cool compress', 'Antihistamine if appropriate'],
	},
	{
		title: 'Urinary symptoms',
		keywords: ['burning urination', 'uti', 'urinary frequency'],
		triage: 'routine',
		recommendedSetting: 'Primary Care',
		guidance:
			'Burning urination or frequency suggests UTI; primary care or urgent care can evaluate. If fever, flank pain, or vomiting, go to urgent care/ER.',
		redFlags: ['Fever', 'Flank pain', 'Vomiting'],
	},
];

/** Returns the first mock response whose keywords are found in the input. */
export function findMockResponse(input: string): ConditionResponse | null {
	const normalized = input.toLowerCase();
	for (const response of conditionResponses) {
		if (response.keywords.some((k) => normalized.includes(k))) {
			return response;
		}
	}
	return null;
}

/** Builds a friendly mock answer for demo/testing when the model is disabled. */
export function buildMockMessage(input: string): string {
	const match = findMockResponse(input);
	if (!match) {
		return (
			"I couldn't match that condition to a preset. For the demo, please enter a common issue (chest pain, stroke, fever, injury, rash) and I’ll suggest a level of care."
		);
	}

	const redFlags = match.redFlags?.length
		? `Red flags: ${match.redFlags.join('; ')}.`
		: '';
	const selfCare = match.selfCareTips?.length
		? `Self-care tips: ${match.selfCareTips.join('; ')}.`
		: '';

	return `${match.title}: ${match.guidance} Recommended setting: ${match.recommendedSetting}. ${redFlags} ${selfCare}`.trim();
}
