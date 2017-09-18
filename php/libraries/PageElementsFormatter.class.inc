<?php

class PageElementsFormatter {
	
	static function formatElement($element, $elName) {
		$tempElement = array(
					"Type" => $element['type'],
					"Name" => $elName,
					"Description" => $element['label'],
				);
		switch ($tempElement['Type']) {
			case 'select':
				$tempElement = self::formatSelect($element, $tempElement);
				break;
			case 'textarea':
			case 'text':
				$tempElement = self::formatText($element, $tempElement);
				break;
			case 'date':
				$tempElement = self::formatDate($element, $tempElement);
				break;
			case 'static':
				$tempElement['Type'] = 'label';
				break;
			case 'header':
				$tempElement['Options'] = array(
        			"Level" => 1
    			);
				break;
			case 'group': 
				$tempElement = self::formatGroup($element, $tempElement);
				break;
		}
		return $tempElement;
	}

	private function formatSelect($oldElem, $newElem) {
		$newElem['Options'] = array(
			'Values' => array(),
			'AllowMultiple' => false,
			'RequireResponse' => false,
		);
		foreach ($oldElem['options'] as $key => $value) {
			$newElem['Options']['Values'][$key] = $value;
		}

		return $newElem;
	}

	private function formatText($oldElem, $newElem) {
		$newElem['Options'] = array(
			'Type' => "small",
			'RequireResponse' => false,
		);

		if($oldElem['type'] === 'textarea') {
			$newElem['Type'] = 'text';
			$newElem['Options']['Type'] = 'large';
		} 

		return $newElem;
	}


	private function formatDate($oldElem, $newElem) {
		$newElem['Options'] = array('RequireResponse' => false);
		if($oldElem['options']['minYear']) {
			$newElem['Options']['MinDate'] = $oldElem['options']['minYear'] . "-01-01";
		}
		if($oldElem['options']['maxYear']) {
			$newElem['Options']['MaxDate'] = $oldElem['options']['maxYear'] . "-12-31";
		}

		return $newElem;
	}

	private function formatGroup($oldElem, $newElem) {
		$newElem['Type'] = "ElementGroup";
		$newElem['GroupType'] = "Element";
		$newElem['Elements'] = array();

		foreach ($oldElem['elements'] as $key => $value) {
			$newElem['Elements'][] = self::formatElement($value, $value['name']);
		}

		return $newElem;
	}

}

?>