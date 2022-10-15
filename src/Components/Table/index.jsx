import React, { useState, useEffect } from 'react';
import api from '../../Service/api'
import Check from '../../Images/icon-check.png';
import { Link } from 'react-router-dom';
import './style.css';

import { toast } from 'react-toastify';

function Index(props) {

    const [selectedEvents, setSelectedEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    let tempUser;

    useEffect(() => {
        async function getEvents() {
            const {data} = await api.get('/events');
            setAllEvents(data);
        }
        getEvents();
    }, []);

    async function handleScheduling(e) {
        const uniqueSelectedEvents = selectedEvents.filter((item, i) => selectedEvents.indexOf(item) === i);

        e.preventDefault();

        if(!uniqueSelectedEvents.length) {
            toast.warning('Escolha algum evento para salvar!', {
                position: "top-center",
                autoClose: 3500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
    
        try {
            const data = {
                eventId: uniqueSelectedEvents, 
                userId: sessionStorage.getItem('userId')
            }

            await api.post('/schedule', data);
            
            tempUser = allEvents.map((event) => {
                setSelectedEvents([]);
                return {...event, isChecked: false}
            });
            setAllEvents(tempUser);

            toast.success('Pronto! Agora você poderá ir aos eventos selecionados.', {
                position: "top-center",
                autoClose: 3500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        }catch (err) {
            toast.error(`Houve um erro: ${err}`, {
                position: "top-center",
                autoClose: 3500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    function handleChange(e) {
        const {name, checked} = e.target;
         if(name === 'allSelected') {
            if(checked) {
                tempUser = allEvents.map((event) => {
                    selectedEvents.push(event.id_evento.toString());
                    return {...event, isChecked: checked}
                });
            } else {
                tempUser = allEvents.map((event) => {
                    setSelectedEvents([]);
                    return {...event, isChecked: checked}
                });
            }
            setAllEvents(tempUser)
        } else {
            let tempUser = allEvents.map((event) => event.id_evento == name ? {...event, isChecked: checked} : event);
            setAllEvents(tempUser);
            if(checked && name !== 'allSelected') {
                selectedEvents.push(name);
            } else {
                selectedEvents.splice(selectedEvents.indexOf(name), 1);
            }
        };
    };

    return (
        <div className='cointaner-table'>
            <section>
                <h3>{props.title}</h3>
                <h3>{props.title2}</h3>
            </section>
            <table className='table'>
                <thead>
                    <th className='colum1'><img src={Check} /></th>
                    <th>{props.colum2}</th>
                    <th>{props.colum3}</th>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input 
                                type='checkbox' 
                                className='checkbox-table' 
                                name='allSelected'
                                checked={allEvents.filter((event) => event.isChecked !== true).length < 1}
                                onChange={handleChange}
                            />
                        </td>
                        <td>-</td>
                        <td>Selecionar Todos</td>
                    </tr>
                    {
                        allEvents.map((event) => 
                            <tr key={event.id_evento}>
                                <td>
                                    <input 
                                        type='checkbox' 
                                        className='checkbox-table' 
                                        name={event.id_evento}
                                        checked={event.isChecked}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>{event.id_evento}</td>
                                <td>{event.descricao}</td>
                            </tr>
                        )                        
                    }                    
                </tbody>
            </table>
            <button className='buttons-table' onClick={handleScheduling}>Salvar</button>
            <Link to='/'><button className='buttons-table'>Cancelar</button></Link>
        </div>
    )
}

export default Index