import './css/Simulation.css';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { dateStore, userStore } from '../../store';
import { simulAPI } from '../../api/api';
import { useEffect, useState } from 'react';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom';
const Simulation = () => {
  const { date, setDate } = dateStore((state) => state);
  const { user } = userStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  let today = user.memberassetCurrentTime;
  today = String(today);
  let userDate =
    today.slice(0, 4) + '.' + today.slice(4, 6) + '.' + today.slice(6, 8);
  return (
    <div>
      {isLoading === true ? <Loading /> : null}
      <div className="simulation">
        <div className="date">{userDate}</div>
        <div className="simul-btn">
          <Stack direction="row" alignItems="center">
            <Button
              sx={{ m: 0.5, px: 1, py: 0.3, minWidth: 0 }}
              color="secondary"
              size="small"
              variant="contained"
              disableElevation
              onClick={() => {
                const changeDate = async () => {
                  setIsLoading(true);
                  await simulAPI
                    .changeDate(1)
                    .then((request) => {})
                    .catch((err) => console.log(err));
                  await simulAPI
                    .currentDate()
                    .then((request) => {
                      setDate(request.data);
                      setTimeout(() => {
                        setIsLoading(false);
                        if (request.data.memberassetCurrentTime === 20221229) {
                          navigate('/more/result');
                        }
                      }, 1000);
                    })
                    .catch((err) => console.log(err));
                };
                changeDate();
              }}
            >
              <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>D+1</span>
            </Button>
            <Button
              sx={{ m: 0.5, px: 1, py: 0.3, minWidth: 0 }}
              size="small"
              color="secondary"
              variant="contained"
              disableElevation
              onClick={() => {
                const changeDate = async () => {
                  setIsLoading(true);
                  await simulAPI
                    .changeDate(7)
                    .then((request) => {})
                    .catch((err) => console.log(err));
                  await simulAPI
                    .currentDate()
                    .then((request) => {
                      setDate(request.data);
                      setTimeout(() => {
                        setIsLoading(false);
                        if (request.data.memberassetCurrentTime === 20221229) {
                          navigate('/more/result');
                        }
                      }, 1000);
                    })
                    .catch((err) => console.log(err));
                };
                changeDate();
              }}
            >
              <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>D+7</span>
            </Button>
            <Button
              sx={{ m: 0.5, px: 0.5, py: 0.3, minWidth: 0 }}
              size="small"
              color="secondary"
              variant="contained"
              disableElevation
              onClick={() => {
                const changeDate = async () => {
                  setIsLoading(true);
                  await simulAPI
                    .changeDate(30)
                    .then((request) => {})
                    .catch((err) => console.log(err));
                  await simulAPI
                    .currentDate()
                    .then((request) => {
                      setDate(request.data);
                      setTimeout(() => {
                        setIsLoading(false);
                        if (request.data.memberassetCurrentTime === 20221229) {
                          navigate('/more/result');
                        }
                      }, 1000);
                    })
                    .catch((err) => console.log(err));
                };
                changeDate();
              }}
            >
              <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>D+30</span>
            </Button>
          </Stack>
        </div>
      </div>
      <hr id="lines" />
    </div>
  );
};

export default Simulation;
