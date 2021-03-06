import React, { Component } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";

import format from "date-fns/format";

import api from "../../utils/api";

// const useStyles = makeStyles({
//     table: {
//       minWidth: 650,
//     },
//   });

// const classes = useStyles();

class FeedingList extends Component {
  constructor() {
    super();
    this.state = {
      feedingEvents: [],
      feedingTime: new Date(),
      page: 0,
      rowsPerPage: 5,
      errors: {},
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    this.getFeedingEvents();
  }

  sortFeedingEvents(arr) {
    arr.sort((a, b) => new Date(b.fedOn) - new Date(a.fedOn));
    // arr.sort((a,b) => (a.amount - b.amount));
    return arr;
  }

  getFeedingEvents() {
    api
      .get("/api/feeding/feeding_events")
      .then((res) =>
        this.setState({ feedingEvents: res.data })
      )
      .catch(function (error) {
        console.log(error);
      });
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onFeedingDateChange = (dt) => {
    this.setState({ feedingTime: dt });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const feedingData = {
      amount: this.state.amount,
      fedOn: this.state.feedingTime,
    };

    api
      .post("/api/feeding/feeding_event", feedingData)
      .then((res) => {
        let rows = this.state.feedingEvents;
        rows.push(res.data);
        this.setState({ feedingEvents: rows });
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  deleteItem(i) {
    const { feedingEvents } = this.state;

    const position = this.state.page * this.state.rowsPerPage + i
    const event = feedingEvents[position];

    api
      .delete(`/api/feeding/feeding_event/${event._id}`)
      .then((res) => {
        feedingEvents.splice(position, 1);
        this.setState({ feedingEvents });
        this.setState({ page: 0});
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
    this.setState({ page: 0 });
  };

  render() {
    return (
      <div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {/* <TableCell>Dessert (100g serving)</TableCell> */}
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Fed On Time</TableCell>
                <TableCell align="right">Fed On Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.sortFeedingEvents(this.state.feedingEvents)
                .slice(
                  this.state.page * this.state.rowsPerPage,
                  this.state.page * this.state.rowsPerPage +
                    this.state.rowsPerPage
                )
                .map((row, i) => (
                  <TableRow key={row.fedOn}>
                    {/* <TableCell component="th" scope="row">
                  {row.fedOn}
                </TableCell> */}
                    <TableCell align="right">{row.amount} oz</TableCell>
                    <TableCell align="right">
                      {format(new Date(row.fedOn), "hh:mm aa")}
                    </TableCell>
                    <TableCell align="right">
                      {format(new Date(row.fedOn), "M/d/yy")}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={this.deleteItem.bind(this, i)}>
                        <Icon color="action">delete</Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <form onSubmit={this.onSubmit}>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell align="right">
                    <Input
                      id="amount"
                      placeholder="Amount"
                      disableUnderline="true"
                      onChange={this.onChange}
                      inputProps={{ style: { fontSize: "12px" } }}
                    />
                  </TableCell>
                  <TableCell align="right" className="sm10">
                    <Grid container>
                      <Grid item xs={10}>
                        <KeyboardDateTimePicker
                          id="feedingTime"
                          variant="inline"
                          value={this.state.feedingTime}
                          onChange={this.onFeedingDateChange}
                          onError={console.log}
                          disableFuture="true"
                          autoOk="true"
                          InputProps={{ disableUnderline: true }}
                          inputProps={{ style: { fontSize: "12px" } }}
                        />
                      </Grid>
                      <Grid item xs={2} className="spacing-xs-1">
                        <IconButton type="submit">
                          <Icon color="primary">add_circle</Icon>
                        </IconButton>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={this.state.feedingEvents.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </div>
    );
  }
}

export default FeedingList;
