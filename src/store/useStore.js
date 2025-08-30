import { create } from 'zustand';

const useStore = create((set) => ({
    // State
    seatingChart: [], // Holds active seating chart
    selectedChart: '', // Selected chart file from set of stored seating chart files
    availableCharts: [], // Set of all available chart files
    allPaddlers: [], // Set of all available paddlers
    allSterns: [], // Set of all available sterns
    allDrummers: [], // Set of all available drummers
    topView: true, // Layout direction of rendered seating chart
    activeId: null, // ID of selected seat in chart
    overId: null, // ID of seat in "drag" state
    drummer: null, // Selected drummer
    stern: null, // Selected stern
    showAddForm: false, // Toggles if "Add paddler" form is shown
    newPaddlerName: '', // String for paddler name
    newPaddlerWeight: '', // String for paddler weight
    extraFrontWeight: 0, // Int for additional weight in front
    extraBackWeight: 0, // Int for additional weight in back
    steeringWeight: 10, // Int for additional steering weight

    // Actions
    setSeatingChart: (chart) => set({ seatingChart: chart }),
    setSelectedChart: (chart) => set({ selectedChart: chart }),
    setAvailableCharts: (charts) => set({ availableCharts: charts }),

    setAllPaddlers: (allPaddlers) => set({ allPaddlers }),
    setAllSterns: (allSterns) => set({ allSterns }),
    setAllDrummers: (allDrummers) => set({ allDrummers }),

    toggleTopView: () => set((state) => ({ topView: !state.topView })),
    setActiveId: (id) => set({ activeId: id }),
    setOverId: (id) => set({ overId: id }),
    setDrummer: (drummer) => set({ drummer }),
    setStern: (stern) => set({ stern }),

    setShowAddForm: (showAddForm) => set({ showAddForm }),
    toggleShowAddForm: () => set((state) => ({ showAddForm: !state.showAddForm })),

    setNewPaddlerName: (newPaddlerName) => set({ newPaddlerName }),
    setNewPaddlerWeight: (newPaddlerWeight) => set({ newPaddlerWeight }),

    setExtraFrontWeight: (extraFrontWeight) => set({ extraFrontWeight }),
    setExtraBackWeight: (extraBackWeight) => set({ extraBackWeight }),
    setSteeringWeight: (steeringWeight) => set({ steeringWeight }),

}));

export default useStore;
