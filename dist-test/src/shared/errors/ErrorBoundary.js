"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * ErrorBoundary
 *
 * React class component that catches JavaScript errors in its child
 * component tree. Renders a fallback UI instead of crashing the app.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary fallback={<CustomFallback />}>
 *     <RiskyComponent />
 *   </ErrorBoundary>
 */
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const logger_1 = require("@/shared/utils/logger");
class ErrorBoundary extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        logger_1.logger.error('ErrorBoundary', 'Uncaught error in component tree', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
        });
        this.props.onError?.(error, errorInfo);
    }
    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };
    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }
        // Custom fallback
        if (this.props.fallback) {
            return this.props.fallback;
        }
        // Default fallback UI
        return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#09090b',
                padding: 24,
            }, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: {
                        color: '#fafafa',
                        fontSize: 20,
                        fontWeight: '700',
                        marginBottom: 8,
                    }, children: "Something went wrong" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: {
                        color: '#a1a1aa',
                        fontSize: 14,
                        textAlign: 'center',
                        marginBottom: 24,
                        lineHeight: 20,
                    }, children: ["An unexpected error occurred.", '\n', "Please try again."] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: this.handleRetry, style: {
                        backgroundColor: '#6366f1',
                        paddingHorizontal: 32,
                        paddingVertical: 14,
                        borderRadius: 12,
                    }, activeOpacity: 0.8, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: { color: '#ffffff', fontSize: 16, fontWeight: '600' }, children: "Try Again" }) })] }));
    }
}
exports.ErrorBoundary = ErrorBoundary;
