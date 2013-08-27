var testCases1 = [
		{
			functionName : "syncState",
			data : {isPlaying: true, volume: 70}
		}];
var testCases2 = [
 		{
 			functionName : "syncState",
 			data : {isPlaying: false, volume: 20}
 		}];
var testCases3 = [
		{
			functionName : "loadNotes",
			data : [{"note":"Page 2"},
			        {"note":"Blak And Blu (Deluxe Version)"},
			        {"note":"Penny Black"},
			        {"note":"good kid, m.A.A.d city (Deluxe) faf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ew faf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ew faf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ew"},
			        {"note":"Page 2"},
			        {"note":"Blak And Blu (Deluxe Version)"},
			        {"note":"Penny Black"},
			        {"note":"III (Deluxe)"},
			        {"note":"We Don't Even Live Here [Deluxe Edition]"},
			        {"note":"good kid, m.A.A.d city"},
			        {"note":"Free Dimensional"},
			        {"note":"Apocryphon"},
			        {"note":"Local Business"},
			        {"note":"good kid, m.A.A.d city (Deluxe) faf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ew faf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ew faf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ew"},
			        {"note":"Page 2"},
			        {"note":"Blak And Blu (Deluxe Version)"},
			        {"note":"Penny Black"},
			        {"note":"III (Deluxe)"},
			        {"note":"We Don't Even Live Here [Deluxe Edition]"},
			        {"note":"good kid, m.A.A.d city"},
			        {"note":"Free Dimensional"},
			        {"note":"Apocryphon"},
			        {"note":"Local Business"}]
		}
		];
var testSuite = [testCases1,testCases2,testCases3];