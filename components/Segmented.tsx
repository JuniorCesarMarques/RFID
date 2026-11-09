import SegmentedControl from '@react-native-segmented-control/segmented-control';

type SegmentedType = {
    selectedTab: number;
    onSelectedTab: (i: number) => void;
}

export default function Segmented({selectedTab, onSelectedTab}: SegmentedType) {

    return (
  <SegmentedControl
    values={['Todos', 'Lidos', 'Pendentes', 'Extras', 'Não Cadastrados']}
    selectedIndex={selectedTab}
    onChange={(event) => {
      onSelectedTab(event.nativeEvent.selectedSegmentIndex);
    }}
  />
);
}

