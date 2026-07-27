"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualizedList = VirtualizedList;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const NoDataCard_1 = require("../feedback/NoDataCard");
const LoadingState_1 = require("../feedback/LoadingState");
function VirtualizedList({ data, isLoading = false, emptyTitle = 'No Items Found', emptyDescription = 'There are no items to show in this view.', emptyIcon = '📂', emptyActionLabel, onEmptyAction, emptyColor, renderItem, keyExtractor, ...props }) {
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(LoadingState_1.LoadingState, { message: "Loading list...", inline: true });
    }
    return ((0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: data, renderItem: renderItem, keyExtractor: keyExtractor, removeClippedSubviews: true, maxToRenderPerBatch: 10, updateCellsBatchingPeriod: 50, initialNumToRender: 8, windowSize: 5, ListEmptyComponent: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "py-4", children: (0, jsx_runtime_1.jsx)(NoDataCard_1.NoDataCard, { title: emptyTitle, description: emptyDescription, icon: emptyIcon, actionLabel: emptyActionLabel, onAction: onEmptyAction, color: emptyColor }) }), ...props }));
}
