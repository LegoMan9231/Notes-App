import React, { useEffect, useState } from 'react';
import axios from 'axios';
const AccountList = () => {
    const [accounts, setAccount] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/api/accounts')
            .then(response => {
                setAccount(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching accounts:', error);
            });
    }, []);
    return (
        <div>
            <h1>Accounts List</h1>
            <ul>
                {accounts.map(accounts => (
                    <li key={accounts.id}>
                        {accounts.username} - {accounts.password} {accounts.project_total}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default AccountList;