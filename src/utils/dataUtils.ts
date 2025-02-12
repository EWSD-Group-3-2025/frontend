type ObjectToArray<T> = T[keyof T] & { keyName: keyof T };

export const objectToArray = <T extends Record<string, object>>(
	obj: T
): ObjectToArray<T>[] => {
	return Object.entries(obj).map(([name, data]) => ({
		keyName: name as keyof T,
		...data,
	})) as ObjectToArray<T>[];
};

type InputObjects = Record<string, Record<string, object>>;

export const transformObjects = <T extends InputObjects>(
	objects: T
): { [K in keyof T]: ObjectToArray<T[K]>[] } => {
	const result = {} as { [K in keyof T]: ObjectToArray<T[K]>[] };

	for (const key in objects) {
		result[key] = objectToArray(objects[key]);
	}

	return result;
};
