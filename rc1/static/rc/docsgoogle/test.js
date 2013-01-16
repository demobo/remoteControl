var testCases = [
		{
			functionName : "loadNotes",
			data : [{"note":"good kid, m.A.A.d city (Deluxe) faf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ew faf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ew faf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ewfaf adfa sawef sdsad fadsfewasf af saafe asafsdfasfaweffvdsdaf sd  afsfsaf ew"},
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

//var testCases = [
// 		{
// 			functionName : "setCurrentPage",
// 			data: 4
// 		}
// 		];