import { FunctionComponent, useState } from 'react';
import Editor from './Editor';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
     * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
     }
`;

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	overflow: hidden;
`;

const App: FunctionComponent = () => {
	const [lines, setLines] = useState<string[]>(['asdasda as da  ', 'gsdg 8124 sadf7 ', '   asd 9a k k g gg 71']);

	return (
		<Container>
			<GlobalStyles />
			<Editor lines={lines} setLines={setLines} />
		</Container>
	);
};

export default App;
