UPDATE employee SET role_id = (SELECT id FROM roles WHERE title = 'Sales Rep')     
                                    WHERE first_name = 'Alex' AND last_name = 'Jones';