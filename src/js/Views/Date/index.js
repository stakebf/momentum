import createNode from '../../Helpers/createNode';
import AppView from '../App';

class DateView {
  dateWrapper = createNode('div', 'date__wrapper');

  timeWrapper = createNode('div', 'time__wrapper');
  timeBlock = createNode('span', 'time__text');

  greetingWrapper = createNode('div', 'greeting__wrapper');
  greetingUser = createNode('div', 'greeting__user');
  greetingBlock = createNode('span', 'greeting');
  dayOfWeekBlock = createNode('span', 'greeting__day-of-week');
  calendarNumberBlock = createNode('span', 'greeting__calendar-number');
  monthBlock = createNode('span', 'greeting__month');

  render(lang, partOfDay) {
    this.timeWrapper.append(this.timeBlock);

    this.greetingUser.append(this.greetingBlock);
    this.setGreetingInfo(lang, partOfDay);
    this.greetingWrapper.append(this.greetingUser, this.dayOfWeekBlock,
      this.calendarNumberBlock, this.monthBlock);

    this.dateWrapper.append(this.timeWrapper, this.greetingWrapper);

    AppView.getContainer().append(this.dateWrapper);

    setTimeout(() => {
      this.dateWrapper.classList.add('date__wrapper_visible');
    }, 300);
  }

  setGreetingInfo({ messages }, partOfDay) {
    const date = new Date();
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const month = date.getMonth();

    this.greetingBlock.innerText = `${messages.timeOfDay[partOfDay]}, `;
    this.dayOfWeekBlock.innerText = `${messages.today} ${messages.day[dayOfWeek]}, `;
    this.calendarNumberBlock.innerText = `${day} `;
    this.monthBlock.innerText = messages.month[month];
  }

  updateTime(time) {
    this.timeBlock.innerText = time;
  }
}

export default new DateView();
