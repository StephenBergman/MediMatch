import ErrorTesting from 'components/_testing/error-testing';
import ScreenView from 'components/Tools/ScreenView';
import React from 'react';

const DevErrorTestingScreen = () => {
	return (
		<ScreenView padded>
			<ErrorTesting />
		</ScreenView>
	);
};

export default DevErrorTestingScreen;
