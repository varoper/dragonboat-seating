import { create } from 'zustand';

const useStore = create((set) => ({
    // State
    seatingChart: [],
    allPaddlers: [],
    allSterns: [],
    allDrummers: [],
    topView: true,
    activeId: null,
    overId: null,
    drummer: null,
    stern: null,
    extraFrontWeight: 0,
    extraBackWeight: 0,
    steeringWeight: 15,

    // const [allPaddlers, setAllPaddlers] = useState([]);
    // const [allSterns, setAllSterns] = useState([]);
    // const [allDrummers, setAllDrummers] = useState([]);


    // Actions
    setSeatingChart: (chart) => set({ seatingChart: chart }),
    setAllPaddlers: (allPaddlers) => set({ allPaddlers }),
    setAllSterns: (allSterns) => set({ allSterns }),
    setAllDrummers: (allDrummers) => set({ allDrummers }),


    toggleTopView: () => set((state) => ({ topView: !state.topView })),
    setActiveId: (id) => set({ activeId: id }),
    setOverId: (id) => set({ overId: id }),
    setDrummer: (drummer) => set({ drummer }),
    setStern: (stern) => set({ stern }),

    setExtraFrontWeight: (extraFrontWeight) => set({ extraFrontWeight }),
    setExtraBackWeight: (extraBackWeight) => set({ extraBackWeight }),
    setSteeringWeight: (steeringWeight) => set({ steeringWeight }),

}));

export default useStore;
