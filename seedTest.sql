UPDATE employee SET role_id = (SELECT id FROM role WHERE title = 'Back End')     
                                    WHERE first_name = 'Junior' AND last_name = 'Gomez'