const API_BASE_URL = "https://api-colombia.com/api/v1";

const fetchJson = async (url) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`API error ${response.status} for ${url}`);
	}
	return response.json();
};

function normalizeText(value) {
	if (value === null || value === undefined) {
		return "";
	}

	return String(value).trim().toLowerCase();
}

function mapPresident(item) {
	return {
		id: String(item.id),
		name: item.name ?? null,
		lastName: item.lastName ?? null,
		image: item.image ?? null,
		politicalParty: item.politicalParty ?? null,
		description: item.description ?? null,
		startPeriodDate: item.startPeriodDate ?? null,
		endPeriodDate: item.endPeriodDate ?? null,
		cityId: item.cityId ?? null,
	};
}

function buildPeriod(president) {
	return {
		presidentId: String(president.id),
		startDate: president.startPeriodDate ?? null,
		endDate: president.endPeriodDate ?? null,
	};
}

async function getPresidents(parent, args, contextValue, info) {
	const data = await fetchJson(`${API_BASE_URL}/President`);
	const list = data.map((item) => mapPresident(item));
	return list;
}

async function getPresidentById(parent, { id }, contextValue, info) {
	const data = await fetchJson(`${API_BASE_URL}/President`);
	const match = data.find((item) => String(item.id) === String(id));
	if (!match) {
		return null;
	}

	return mapPresident(match);
}

async function getPeriodsByPresident(parent, { presidentId }, contextValue, info) {
	const data = await fetchJson(`${API_BASE_URL}/President`);
	const match = data.find((item) => String(item.id) === String(presidentId));
	if (!match) {
		return [];
	}

	return [buildPeriod(match)];
}

async function getPresidentsByParty(parent, { politicalParty }, contextValue, info) {
	const data = await fetchJson(`${API_BASE_URL}/President`);
	const normalizedParty = normalizeText(politicalParty);
	const filtered = data.filter((item) => {
		const party = normalizeText(item.politicalParty ?? "");
		return party.includes(normalizedParty);
	});
	const list = filtered.map((item) => mapPresident(item));
	return list;
}

async function getPresidentsByName(parent, { name }, contextValue, info) {
	const data = await fetchJson(`${API_BASE_URL}/President`);
	const normalizedName = normalizeText(name);
	const filtered = data.filter((item) => {
		const firstName = normalizeText(item.name ?? "");
		const lastName = normalizeText(item.lastName ?? "");
		return (
			firstName.includes(normalizedName) ||
			lastName.includes(normalizedName)
		);
	});
	const list = filtered.map((item) => mapPresident(item));
	return list;
}

async function getPresidentsByLastName(parent, { lastName }, contextValue, info) {
	const data = await fetchJson(`${API_BASE_URL}/President`);
	const normalizedLastName = normalizeText(lastName);
	const filtered = data.filter((item) => {
		const currentLastName = normalizeText(item.lastName ?? "");
		return currentLastName.includes(normalizedLastName);
	});
	const list = filtered.map((item) => mapPresident(item));
	return list;
}

function getPresidentFullName(president, args, contextValue, info) {
	const parts = [president.name, president.lastName].filter(Boolean);
	if (parts.length === 0) {
		return null;
	}

	return parts.join(" ");
}

function getPresidentPeriods(president, args, contextValue, info) {
	return [buildPeriod(president)];
}

export {
	getPresidents,
	getPresidentById,
	getPeriodsByPresident,
	getPresidentsByParty,
	getPresidentsByName,
	getPresidentsByLastName,
	getPresidentFullName,
	getPresidentPeriods,
};
