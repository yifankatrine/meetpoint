import { Outlet } from 'react-router-dom';
import LeftNavigation from '../../components/page/left-navigation/LeftNavigation';
import './tape-page.css';
import { useState } from 'react';

function TapePage() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`tape-page ${isCollapsed ? 'collapsed' : ''}`}>
            <LeftNavigation
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />
            <div className='tape-page__content'>
                <Outlet />
            </div>
        </div>
    );
}

export default TapePage;