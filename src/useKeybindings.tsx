import { useEffect } from 'react';

type Keybindings = { [key: string]: () => void };

const useKeybindings = (keybindings: Keybindings) => {
	const onKey = (event: KeyboardEvent) => {
		const key = (event.ctrlKey ? 'C-' : '') + event.key;

		const callback = keybindings[key];
		if (callback) callback();
	};

	useEffect(() => {
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
};

export default useKeybindings;
